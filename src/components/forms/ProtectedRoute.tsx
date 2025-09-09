'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
    if (!isAuthenticated()) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, checkSession, router]);

  if (!isAuthenticated()) {
    return <div>Redirecting...</div>;
  }

  return <>{children}</>;
}