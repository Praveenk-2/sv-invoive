'use client';

import Link from 'next/link';
import { useState } from 'react';
import { authApi, LoginRequest } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import loginbg from '@/public/images/login-bg.png';
import logindiv from '@/public/images/frame-bg.webp';

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.login(formData);

      if (response.success && response.data?.token) {
        // ✅ Save token safely (client-side)
        localStorage.setItem('token', response.data.token);

        // ✅ Next.js navigation
        router.push('/dashboard');
      } else {
        setError(response.error || 'Invalid username or password');
      }
    } catch (err) {
      setError('Network error. Please check backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-[100vh] w-full flex items-center justify-center px-5 bg-cover bg-center"
      style={{ backgroundImage: `url(${loginbg.src})` }}
    >
      <div
        className="w-[500px] rounded-[20px] p-6 bg-cover bg-center"
        style={{ backgroundImage: `url(${logindiv.src})` }}
      >
        <h2 className="text-[30px] font-semibold text-center mb-5">
          Sign In!
        </h2>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
              ⚠️ {error}
            </div>
          )}

          {/* Username */}
          <div className="mb-4 flex items-center gap-2 bg-[#eff3f6] px-4 py-2 rounded">
            <MdEmail />
            <input
              type="text"
              placeholder="Enter username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              disabled={loading}
              className="w-full bg-transparent outline-none"
            />
          </div>

          {/* Password */}
          <div className="mb-6 flex items-center gap-2 bg-[#eff3f6] px-4 py-2 rounded relative">
            <RiLockPasswordFill />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              disabled={loading}
              className="w-full bg-transparent outline-none"
            />

            {showPassword ? (
              <IoMdEye
                className="absolute right-4 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <IoMdEyeOff
                className="absolute right-4 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded text-white font-bold ${
              loading ? 'bg-gray-400' : 'bg-blue-600'
            }`}
          >
            {loading ? '⏳ Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
