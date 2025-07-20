'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

export function useSessionTracking() {
  const { data: session, status } = useSession();
  const hasTracked = useRef(false);

  useEffect(() => {
    const trackSession = async () => {
      // Only track once per session and when authenticated
      if (
        status === 'authenticated' && 
        session?.user?.id && 
        !hasTracked.current
      ) {
        try {
          const response = await fetch('/api/auth/sessions/track', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Session tracked:', data.sessionToken);
            hasTracked.current = true;
          }
        } catch (error) {
          console.error('Error tracking session:', error);
        }
      }
    };

    // Track session when user is authenticated
    trackSession();

    // Also track on focus (user returns to tab)
    const handleFocus = () => {
      if (status === 'authenticated' && session?.user?.id) {
        trackSession();
      }
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [status, session?.user?.id]);

  // Reset tracking flag when session changes
  useEffect(() => {
    if (status === 'unauthenticated') {
      hasTracked.current = false;
    }
  }, [status]);

  return {
    isTracking: status === 'authenticated' && hasTracked.current,
    session,
    status
  };
}
