import { NextRequest, NextResponse } from "next/server"
// import { PrismaClient } from "@prisma/client"
import { auth } from "@/lib/auth"

// const prisma = new PrismaClient()

// Import the same notes array (in a real app, use proper state management)
// For demo purposes, we'll access the notes from the parent route
let notes: any[] = []

// Helper function to get notes (simulate database)
function getNotesFromMemory() {
  return notes.length > 0 ? notes : [
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
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, category, tags, isPinned } = await request.json()

    // Get current notes
    notes = getNotesFromMemory()

    // Find the note and check if it belongs to the user
    const noteIndex = notes.findIndex(note => note.id === params.id && note.userId === session.user.id)

    if (noteIndex === -1) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    // Update the note
    notes[noteIndex] = {
      ...notes[noteIndex],
      title,
      content,
      category,
      tags: tags || [],
      isPinned: isPinned !== undefined ? isPinned : notes[noteIndex].isPinned,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(notes[noteIndex])

    // Database version (commented out)
    /*
    // Check if note belongs to user
    const existingNote = await prisma.note.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    const note = await prisma.note.update({
      where: { id: params.id },
      data: {
        title,
        content,
        category,
        tags: tags || [],
        isPinned
      }
    })

    return NextResponse.json(note)
    */
  } catch (error) {
    console.error("Error updating note:", error)
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current notes
    notes = getNotesFromMemory()

    // Find the note and check if it belongs to the user
    const noteIndex = notes.findIndex(note => note.id === params.id && note.userId === session.user.id)

    if (noteIndex === -1) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    // Remove the note
    notes.splice(noteIndex, 1)

    return NextResponse.json({ message: "Note deleted successfully" })

    // Database version (commented out)
    /*
    // Check if note belongs to user
    const existingNote = await prisma.note.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    await prisma.note.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Note deleted successfully" })
    */
  } catch (error) {
    console.error("Error deleting note:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
