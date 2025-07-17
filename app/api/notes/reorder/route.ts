import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { noteIds } = await request.json()

    if (!Array.isArray(noteIds)) {
      return NextResponse.json(
        { error: 'noteIds must be an array' },
        { status: 400 }
      )
    }

    // Verify all notes belong to the user
    const notes = await prisma.note.findMany({
      where: {
        id: { in: noteIds },
        userId: session.user.id
      }
    })

    if (notes.length !== noteIds.length) {
      return NextResponse.json(
        { error: 'Some notes not found or unauthorized' },
        { status: 400 }
      )
    }

    // Update the order for each note
    const updatePromises = noteIds.map((noteId: string, index: number) =>
      prisma.note.update({
        where: { id: noteId },
        data: { order: index }
      })
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering notes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
