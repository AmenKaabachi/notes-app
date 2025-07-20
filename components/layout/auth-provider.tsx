'use client'

import { SessionProvider } from 'next-auth/react'
import { SessionTracker } from '@/components/auth/SessionTracker'

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <SessionTracker />
      {children}
    </SessionProvider>
  )
}
