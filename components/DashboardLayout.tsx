'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
// import { logout } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();


  const { logout } = useAuth();


  // const handleLogout = async () => {
  //   // await logout();
  //   router.push('/login');
  // };

  // Simple menu items - direct links, no submenus
  const menuItems = [
    {
      name: 'Roles',
      href: '/dashboard/roles',
      icon: Settings,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverBg: 'hover:bg-blue-100',
    },
    {
      name: 'Users',
      href: '/dashboard/users',
      icon: Settings,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverBg: 'hover:bg-blue-100',
    },
    {
      name: 'User Roles',
      href: '/dashboard/user-roles',
      icon: Settings,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverBg: 'hover:bg-blue-100',
    },
    {
      name: 'Items',
      href: '/dashboard/items',
      icon: Settings,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverBg: 'hover:bg-blue-100',
    },
    {
      name: 'Master',
      href: '/dashboard/master',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverBg: 'hover:bg-blue-100',
    },
    {
      name: 'Transaction',
      href: '/dashboard/transaction',
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverBg: 'hover:bg-blue-100',
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverBg: 'hover:bg-blue-100',
    },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Simple Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shadow-lg text-white bg-[#448aff] transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold">Menu</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-blue-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Info */}
        {/* <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.email || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'Member'}</p>
            </div>
          </div>
        </div> */}

        {/* Navigation Tabs */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg transition-all hover:text-blue-400 ${isActive(item.href)
                    ? `${item.bgColor} ${item.color} font-medium shadow-sm`
                    : `text-white ${item.hoverBg}`
                  }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={async () => {
              try {
                await logout();

                localStorage.clear();
                document.cookie.split(";").forEach((c) => {
                  document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });

                // Redirect to login
                router.push('/login');
              } catch (error) {
                console.error('Logout failed:', error);
                // Even if error, force redirect
                localStorage.clear();
                router.push('/login');
              } finally {
                // Ensure sidebar closes on mobile
                setSidebarOpen(false);
              }
            }}
            className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-all font-medium"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                {pathname === '/dashboard'
                  ? 'Dashboard'
                  : pathname.split('/')[2]?.charAt(0).toUpperCase() + pathname.split('/')[2]?.slice(1) || 'Page'}
              </h2>
            </div>

            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}