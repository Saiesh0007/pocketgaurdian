import { type NextRequest, NextResponse } from "next/server"

// Mock user database - replace with real database
const users: Record<string, { id: string; name: string; email: string; password: string }> = {}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = Object.values(users).find((u) => u.email === email)
    if (existingUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 409 })
    }

    // Create new user
    const userId = `user_${Date.now()}`
    users[userId] = {
      id: userId,
      name,
      email,
      password, // In production, hash this!
    }

    // Generate mock token
    const token = Buffer.from(`${userId}:${Date.now()}`).toString("base64")

    return NextResponse.json({
      user: {
        id: userId,
        name,
        email,
      },
      token,
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
