import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getCurrentSessionToken } from '@/lib/session-utils'

// Enhanced session tracking using the Session model
interface SessionInfo {
  id: string
  userId: string
  deviceInfo?: string
  ipAddress?: string
  userAgent?: string
  lastActivity: Date
  createdAt: Date
}

// GET - List active sessions for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current session info
    const currentSessionToken = getCurrentSessionToken(request)
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'Unknown'

    // Create or update current session tracking
    if (currentSessionToken) {
      await prisma.session.upsert({
        where: {
          sessionToken: currentSessionToken
        },
        create: {
          sessionToken: currentSessionToken,
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
    }

    // Get all recent sessions (active in last 30 days)
    const recentSessions = await prisma.session.findMany({
      where: {
        userId: session.user.id,
        lastActivity: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      },
      orderBy: {
        lastActivity: 'desc'
      }
    })

    // Transform sessions for response
    const maskedSessions = recentSessions.map(s => ({
      id: s.id,
      sessionToken: '***' + s.sessionToken.slice(-8),
      deviceInfo: s.userAgent ? parseUserAgent(s.userAgent) : 'Unknown Device',
      location: s.ipAddress,
      lastActivity: s.lastActivity,
      createdAt: s.createdAt,
      isCurrent: s.sessionToken === currentSessionToken
    }))

    return NextResponse.json({
      sessions: maskedSessions,
      total: maskedSessions.length
    })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Revoke specific session or all sessions
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId, revokeAll } = await request.json()

    if (revokeAll) {
      const currentSessionToken = getCurrentSessionToken(request)
      
      // Delete all sessions except current one
      await prisma.session.deleteMany({
        where: {
          userId: session.user.id,
          NOT: {
            sessionToken: currentSessionToken
          }
        }
      })

      return NextResponse.json({ 
        message: 'All other sessions revoked successfully' 
      })
    } else if (sessionId) {
      // Delete specific session
      const deletedSession = await prisma.session.delete({
        where: {
          id: sessionId,
          userId: session.user.id
        }
      })

      return NextResponse.json({ 
        message: 'Session revoked successfully',
        sessionId: deletedSession.id
      })
    } else {
      return NextResponse.json({ 
        error: 'Either sessionId or revokeAll must be provided' 
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Error revoking sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to parse user agent
function parseUserAgent(userAgent: string): string {
  if (userAgent.includes('Chrome')) return '🌐 Chrome Browser'
  if (userAgent.includes('Firefox')) return '🦊 Firefox Browser'
  if (userAgent.includes('Safari')) return '🧭 Safari Browser'
  if (userAgent.includes('Edge')) return '📘 Edge Browser'
  if (userAgent.includes('Mobile')) return '📱 Mobile Device'
  if (userAgent.includes('iPad')) return '📱 iPad'
  if (userAgent.includes('iPhone')) return '📱 iPhone'
  if (userAgent.includes('Android')) return '🤖 Android Device'
  return '💻 Unknown Device'
}
