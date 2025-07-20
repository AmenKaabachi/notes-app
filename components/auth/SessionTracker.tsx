'use client';

import { useSessionTracking } from '@/hooks/useSessionTracking';

export function SessionTracker() {
  // This component will automatically track sessions when mounted
  const { isTracking } = useSessionTracking();
  
  // This component renders nothing but enables session tracking
  return null;
}
