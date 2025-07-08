import { NextRequest, NextResponse } from "next/server"
// import bcrypt from "bcryptjs"
// import { PrismaClient } from "@prisma/client"

// const prisma = new PrismaClient()

// Registration disabled for demo - using hardcoded users
export async function POST(request: NextRequest) {
  try {
    return NextResponse.json(
      { error: "Registration is disabled in demo mode. Use demo@example.com / demo123 or admin@example.com / admin123" },
      { status: 400 }
    )

    // Database version (commented out)
    /*
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    })

    return NextResponse.json({
      message: "User created successfully",
      user: { id: user.id, email: user.email, name: user.name }
    })
    */
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
