'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { logout as logoutUtil, validateCurrentSession } from '@/lib/logout';

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  // Enhanced logout function using the utility
  const logout = useCallback(async () => {
    await logoutUtil({
      redirect: true,
      callbackUrl: '/login',
      clearStorage: true
    });
  }, []);

  // Session validation function
  const validateSession = useCallback(async () => {
    if (status === 'authenticated') {
      const isValid = await validateCurrentSession();
      if (!isValid) {
        console.log('Session invalid, logging out...');
        await logout();
        return false;
      }
      return true;
    }
    return false;
  }, [status, logout]);

  // Force refresh session
  const refreshSession = useCallback(async () => {
    try {
      await update();
    } catch (error) {
      console.error('Session refresh error:', error);
      await logout();
    }
  }, [update, logout]);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Periodic session validation
  useEffect(() => {
    if (status === 'authenticated') {
      const interval = setInterval(validateSession, 30000); // Check every 30 seconds
      
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          validateSession();
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        clearInterval(interval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [status, validateSession]);

  return {
    session,
    status,
    user: session?.user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    logout,
    validateSession,
    refreshSession
  };
}
