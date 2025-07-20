import { signOut } from 'next-auth/react'

export interface LogoutOptions {
  redirect?: boolean
  callbackUrl?: string
  clearStorage?: boolean
}

/**
 * Enhanced logout function that properly clears all session data
 * @param options Configuration options for logout behavior
 */
export async function logout(options: LogoutOptions = {}) {
  const {
    redirect = true,
    callbackUrl = '/login',
    clearStorage = true
  } = options

  try {
    // Clear local storage if requested
    if (clearStorage) {
      localStorage.clear()
      sessionStorage.clear()
      
      // Clear any other custom storage
      try {
        // Clear IndexedDB if you're using it
        if ('indexedDB' in window) {
          const databases = await indexedDB.databases?.() || []
          for (const db of databases) {
            if (db.name) {
              indexedDB.deleteDatabase(db.name)
            }
          }
        }
      } catch (error) {
        console.warn('Could not clear IndexedDB:', error)
      }
    }

    // Clear all cookies manually (in case NextAuth doesn't clear everything)
    if (typeof document !== 'undefined') {
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
      })
    }

    // Sign out with NextAuth
    await signOut({ 
      callbackUrl,
      redirect: false  // We'll handle redirect manually
    })

    // Force navigation if redirect is enabled
    if (redirect && typeof window !== 'undefined') {
      // Small delay to ensure signOut completes
      setTimeout(() => {
        window.location.href = callbackUrl
      }, 100)
    }

  } catch (error) {
    console.error('Logout error:', error)
    
    // Fallback: force reload to login page
    if (typeof window !== 'undefined') {
      window.location.href = callbackUrl
    }
  }
}

/**
 * Check if the current session is valid
 */
export async function validateCurrentSession(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/validate')
    return response.ok
  } catch (error) {
    console.error('Session validation error:', error)
    return false
  }
}

/**
 * Force a complete logout with page reload
 */
export function forceLogout(callbackUrl: string = '/login') {
  if (typeof window !== 'undefined') {
    // Clear everything
    localStorage.clear()
    sessionStorage.clear()
    
    // Clear cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
    })
    
    // Force navigation
    window.location.href = callbackUrl
  }
}
