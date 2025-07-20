import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'Unknown'
    
    // Get session token from cookies
    const cookies = request.headers.get('cookie') || ''
    const sessionTokenMatch = cookies.match(/next-auth\.session-token=([^;]+)/) ||
                             cookies.match(/__Secure-next-auth\.session-token=([^;]+)/)
    
    const sessionToken = sessionTokenMatch?.[1] || `jwt_${Date.now()}_${Math.random().toString(36).substring(2)}`
    
    // Create or update session in database
    const dbSession = await prisma.session.upsert({
      where: {
        sessionToken: sessionToken
      },
      create: {
        sessionToken,
        userId: session.user.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        userAgent,
        ipAddress,
        lastActivity: new Date(),
      },
      update: {
        lastActivity: new Date(),
        userAgent,
        ipAddress,
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      sessionId: dbSession.id,
      sessionToken: '***' + sessionToken.slice(-8) // Masked token for client
    })
  } catch (error) {
    console.error('Error tracking session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
