import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // With JWT sessions, we just need to verify the session exists and is valid
    // The JWT token itself handles expiration
    return NextResponse.json({ 
      valid: true, 
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name
      },
      sessionInfo: {
        strategy: 'jwt'
      }
    })
  } catch (error) {
    console.error('Session validation error:', error)
    return NextResponse.json({ error: 'Session validation failed' }, { status: 401 })
  }
}
