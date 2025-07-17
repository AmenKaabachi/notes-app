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
  order: number;
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

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const notes = await prisma.note.findMany({
      where: { userId: session.user.id },
      include: {
        category: true,
        noteTags: {
          include: { tag: true }
        }
      },
      orderBy: [
        { isPinned: 'desc' },
        { order: 'asc' },
        { updatedAt: 'desc' }
      ]
    })

    // Transform the data to match the expected format
    const transformedNotes = notes.map((note: NoteWithRelations) => ({
      id: note.id,
      title: note.title,
      content: note.content,
      category: note.category?.name || '',
      tags: note.noteTags.map(nt => nt.tag.name),
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      isPinned: note.isPinned,
      order: note.order,
      categoryId: note.categoryId,
      userId: note.userId
    }))

    return NextResponse.json(transformedNotes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, content, category, tags, isPinned } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Get the maximum order value for this user's notes
    const maxOrderNote = await prisma.note.findFirst({
      where: { userId: session.user.id },
      orderBy: { order: 'desc' }
    })
    const nextOrder = (maxOrderNote?.order ?? -1) + 1

    // Create or find category
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

    // Create note
    const note = await prisma.note.create({
      data: {
        title,
        content,
        isPinned: isPinned || false,
        order: nextOrder,
        userId: session.user.id,
        categoryId: categoryRecord?.id
      },
      include: {
        category: true,
        noteTags: {
          include: { tag: true }
        }
      }
    })

    // Handle tags
    if (tags && Array.isArray(tags)) {
      for (const tagName of tags) {
        // Create or find tag
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

        // Create note-tag relationship
        await prisma.noteTag.create({
          data: {
            noteId: note.id,
            tagId: tag.id
          }
        })
      }
    }

    // Fetch the complete note with relationships
    const completeNote = await prisma.note.findUnique({
      where: { id: note.id },
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
      isPinned: (completeNote as NoteWithRelations)!.isPinned,
      order: (completeNote as NoteWithRelations)!.order,
      categoryId: (completeNote as NoteWithRelations)!.categoryId,
      userId: (completeNote as NoteWithRelations)!.userId
    }

    return NextResponse.json(transformedNote, { status: 201 })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
