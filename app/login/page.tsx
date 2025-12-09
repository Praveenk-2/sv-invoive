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

    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const [formData, setFormData] = useState<LoginRequest>({
        username: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        console.log('🔄 Attempting login with:', formData.username);

        try {
            const response = await authApi.login(formData);

            console.log('📥 Login Response:', response);

            if (response.success && response.data?.token) {
                console.log('✅ Login successful! Token received:', response.data.token.substring(0, 20) + '...');

                await new Promise(resolve => setTimeout(resolve, 100));

                console.log('🔀 Redirecting to dashboard...');
                window.location.href = '/dashboard/master';  // ← Changed from '/dashboard/master'

            } else {
                console.error('❌ Login failed:', response);
                setError(response.error || 'Invalid username or password');
            }
        } catch (err) {
            console.error('💥 Login error:', err);
            setError('Network error. Please check if backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <div className='login-bg h-[100vh] w-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-5 px-md-0' style={{ backgroundImage: `url(${loginbg.src})` }}>
                <div className='login-div w-[500px] rounded-[20px] p-5 p-md-10 bg-cover bg-center bg-no-repeat' style={{ backgroundImage: `url(${logindiv.src})` }}>
                    <h2 className='text-[30px] font-semibold text-center mb-5'>Sign In!</h2>
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div style={{
                                padding: '12px',
                                marginBottom: '15px',
                                backgroundColor: '#fee',
                                color: '#c33',
                                borderRadius: '4px',
                                border: '1px solid #fcc'
                            }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="mb-2">
                            <div className='mb-4 flex items-center gap-2 bg-[#eff3f6] px-[15px] py-[10px] rounded-[10px]'>
                                <label htmlFor="email" className="">
                                    <MdEmail className='' />
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    disabled={loading}
                                    placeholder="Enter username" className='focus:outline-none focus:ring-0'
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        // border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                            <div className='mb-2 flex items-center gap-2 bg-[#eff3f6] px-[15px] py-[10px] rounded-[10px] relative'>
                                <label htmlFor="password" className="">
                                    <RiLockPasswordFill className='' />
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    disabled={loading}
                                    placeholder="Enter password"
                                    className="focus:outline-none focus:ring-0"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}
                                />
                                {showPassword ? (
                                    <IoMdEye
                                        className="absolute right-[15px] top-1/2 -translate-y-1/2 cursor-pointer z-[11]"
                                        onClick={() => setShowPassword(false)}
                                    />
                                ) : (
                                    <IoMdEyeOff
                                        className="absolute right-[15px] top-1/2 -translate-y-1/2 cursor-pointer z-[11]"
                                        onClick={() => setShowPassword(true)}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded hover:cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 text-[12px]">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link href="/forgot-password" className="font-medium text-[12px] text-[#000] hover:text-indigo-500">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: loading ? '#ccc' : '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontSize: '16px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {loading ? '⏳ Logging in...' : '🔐 Login'}
                            </button>
                        </div>

                        {/* <div className="text-center">
                            <span className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link href="/register" className="font-medium text-black hover:text-indigo-500">
                                    Sign up
                                </Link>
                            </span>
                        </div> */}
                    </form>
                </div>
            </div>
        </>
    );
}