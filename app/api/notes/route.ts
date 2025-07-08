import { NextRequest, NextResponse } from "next/server"
// import { PrismaClient } from "@prisma/client"
import { auth } from "@/lib/auth"

// const prisma = new PrismaClient()

// In-memory storage for demo (in production, use a proper database)
let notes: any[] = [
  {
    id: "1",
    title: "Welcome to Notes App",
    content: "This is your first note! You can create, edit, and delete notes here.",
    category: "General",
    tags: ["welcome", "demo"],
    isPinned: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "1"
  },
  {
    id: "2",
    title: "Demo Credentials",
    content: "Login with:\n- Email: demo@example.com\n- Password: demo123\n\nOr:\n- Email: admin@example.com\n- Password: admin123",
    category: "Information",
    tags: ["login", "demo"],
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "1"
  }
]

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Filter notes by user ID
    const userNotes = notes.filter(note => note.userId === session.user.id)
    
    // Sort by pinned first, then by updated date
    const sortedNotes = userNotes.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })

    return NextResponse.json(sortedNotes)

    // Database version (commented out)
    /*
    const notes = await prisma.note.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: [
        { isPinned: 'desc' },
        { updatedAt: 'desc' }
      ]
    })

    return NextResponse.json(notes)
    */
  } catch (error) {
    console.error("Error fetching notes:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, category, tags } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    // Create new note
    const newNote = {
      id: Date.now().toString(),
      title,
      content,
      category,
      tags: tags || [],
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: session.user.id
    }

    notes.unshift(newNote)

    return NextResponse.json(newNote)

    // Database version (commented out)
    /*
    const note = await prisma.note.create({
      data: {
        title,
        content,
        category,
        tags: tags || [],
        userId: session.user.id
      }
    })

    return NextResponse.json(note)
    */
  } catch (error) {
    console.error("Error creating note:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
