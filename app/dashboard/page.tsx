'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  return (router.push('/dashboard/master'));

  return (
    // <ProtectedRoute>
      <></>
    // </ProtectedRoute>
  );
}