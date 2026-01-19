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
import Dropdown from 'react-bootstrap/esm/Dropdown';

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
          {/* <h1 className="text-[18px]">Menu</h1> */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-blue-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 px-4 py-6 space-y-4 h-[600px] scroll-bar">
          <Dropdown className="space-y-2" drop="end">
            <Dropdown.Toggle id="dropdown-basic" className='m-head'>
              Master
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="/dashboard/users">Users</Dropdown.Item>
              <Dropdown.Item href="/dashboard/roles">Roles</Dropdown.Item>
              <Dropdown.Item href="/dashboard/user-roles">User Role</Dropdown.Item>
              <div className='p-0'>
                <Dropdown drop="end">
                  <Dropdown.Toggle className='dropdown-item' id="dropdown-basic">
                    Item-Master
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="/dashboard/items">Items</Dropdown.Item>
                    <Dropdown.Item href="/dashboard/item-batches">Item Batches</Dropdown.Item>
                    <Dropdown.Item href="/dashboard/categories">Item Category</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div>
                <Dropdown drop="end">
                  <Dropdown.Toggle className='dropdown-item' id="dropdown-basic">
                    Customer master
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="/dashboard/customers">Customer</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div>
                <Dropdown drop="end">
                  <Dropdown.Toggle className='dropdown-item' id="dropdown-basic">
                    supplier
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="/dashboard/units">units</Dropdown.Item>
                    <Dropdown.Item href="/dashboard/suppliers">suppliers</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <Dropdown.Item href="/dashboard/warehouses">Warehouse</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {/* Transction dropdown */}
          <Dropdown className="space-y-2" drop="end">
            <Dropdown.Toggle id="dropdown-basic" className='m-head'>
              Transaction
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <div className='p-0'>
                <Dropdown drop="end">
                  <Dropdown.Toggle className='dropdown-item' id="dropdown-basic">
                    Purchase
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="/dashboard/purchase-orders">Purchase Orders</Dropdown.Item>
                    <Dropdown.Item href="/dashboard/purchase-order-items">Purchase order items</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <Dropdown.Item href="#/action-3">Sales</Dropdown.Item>
              <div>
                <Dropdown drop="end">
                  <Dropdown.Toggle className='dropdown-item' id="dropdown-basic">
                    Goods
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="/dashboard/goods-receipts">Goods receipt</Dropdown.Item>
                    <Dropdown.Item href="/dashboard/goods-receipt-items">Goods receipt items</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div>
                <Dropdown drop="end">
                  <Dropdown.Toggle className='dropdown-item' id="dropdown-basic">
                    Stock
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="/dashboard/stock-extended">Stock</Dropdown.Item>
                    <Dropdown.Item href="/dashboard/stock-ledger">Stock ledger</Dropdown.Item>
                    <Dropdown.Item href="/dashboard/adjustments">Stock adjustment</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Dropdown.Menu>
          </Dropdown>
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
            className="w-full flex items-center px-4 py-3 text-red-500 hover:cursor-pointer hover:bg-red-50 rounded-lg transition-all font-medium"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        {/* <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
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
        </header> */}

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}