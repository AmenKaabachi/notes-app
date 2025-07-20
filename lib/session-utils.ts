import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Extract the current session token from cookies
 * Handles both secure and non-secure cookie names
 */
export function getCurrentSessionToken(request?: NextRequest): string | undefined {
  if (request) {
    // For API routes with request object
    const sessionToken = request.cookies.get('next-auth.session-token')?.value || 
                        request.cookies.get('__Secure-next-auth.session-token')?.value
    return sessionToken
  } else {
    // For server components/actions without request
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('next-auth.session-token')?.value || 
                        cookieStore.get('__Secure-next-auth.session-token')?.value
    return sessionToken
  }
}

/**
 * Get session cookie name based on environment
 */
export function getSessionCookieName(): string {
  // In production with HTTPS, NextAuth uses secure cookie names
  return process.env.NODE_ENV === 'production' 
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token'
}

/**
 * Extract session token from various sources (useful for debugging)
 */
export function extractSessionTokens(request: NextRequest) {
  const allCookies = request.cookies.getAll()
  const sessionCookies = allCookies.filter(cookie => 
    cookie.name.includes('session-token')
  )
  
  return {
    allCookies: allCookies.map(c => ({ name: c.name, value: c.value.slice(0, 10) + '...' })),
    sessionCookies,
    currentToken: getCurrentSessionToken(request)
  }
}
