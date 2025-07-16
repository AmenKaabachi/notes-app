import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Type for note with included relations
type NoteWithRelations = {
  id: string;
  title: string;
  content: string;
  categoryId: string | null;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  category: { id: string; name: string; userId: string; createdAt: Date } | null;
  noteTags: Array<{
    id: string;
    noteId: string;
    tagId: string;
    createdAt: Date;
    tag: { id: string; name: string; userId: string; createdAt: Date };
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const note = await prisma.note.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        category: true,
        noteTags: {
          include: { tag: true }
        }
      }
    }) as any

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    // Transform the data
    const transformedNote = {
      id: note.id,
      title: note.title,
      content: note.content,
      category: note.category?.name || '',
      tags: note.noteTags?.map((nt: any) => nt.tag.name) || [],
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      isPinned: note.isPinned
    }

    return NextResponse.json(transformedNote)
  } catch (error) {
    console.error('Error fetching note:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, content, category, tags, isPinned } = await request.json()

    // Verify note exists and belongs to user
    const existingNote = await prisma.note.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    // Handle category
    let categoryRecord = null
    if (category) {
      categoryRecord = await prisma.category.upsert({
        where: {
          name_userId: {
            name: category,
            userId: session.user.id
          }
        },
        create: {
          name: category,
          userId: session.user.id
        },
        update: {}
      })
    }

    // Update note
    const updatedNote = await prisma.note.update({
      where: { id: params.id },
      data: {
        title: title ?? existingNote.title,
        content: content ?? existingNote.content,
        isPinned: isPinned ?? existingNote.isPinned,
        categoryId: categoryRecord?.id ?? existingNote.categoryId
      },
      include: {
        category: true,
        noteTags: {
          include: { tag: true }
        }
      }
    })

    // Handle tags update
    if (tags && Array.isArray(tags)) {
      // Remove existing tag relationships
      await prisma.noteTag.deleteMany({
        where: { noteId: params.id }
      })

      // Add new tag relationships
      for (const tagName of tags) {
        const tag = await prisma.tag.upsert({
          where: {
            name_userId: {
              name: tagName,
              userId: session.user.id
            }
          },
          create: {
            name: tagName,
            userId: session.user.id
          },
          update: {}
        })

        await prisma.noteTag.create({
          data: {
            noteId: params.id,
            tagId: tag.id
          }
        })
      }
    }

    // Fetch the complete updated note
    const completeNote = await prisma.note.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        noteTags: {
          include: { tag: true }
        }
      }
    })

    // Transform the data
    const transformedNote = {
      id: (completeNote as NoteWithRelations)!.id,
      title: (completeNote as NoteWithRelations)!.title,
      content: (completeNote as NoteWithRelations)!.content,
      category: (completeNote as NoteWithRelations)!.category?.name || '',
      tags: (completeNote as NoteWithRelations)!.noteTags.map(nt => nt.tag.name),
      createdAt: (completeNote as NoteWithRelations)!.createdAt,
      updatedAt: (completeNote as NoteWithRelations)!.updatedAt,
      isPinned: (completeNote as NoteWithRelations)!.isPinned
    }

    return NextResponse.json(transformedNote)
  } catch (error) {
    console.error('Error updating note:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify note exists and belongs to user
    const existingNote = await prisma.note.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    // Delete note (this will cascade delete note-tag relationships)
    await prisma.note.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Note deleted successfully' })
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
