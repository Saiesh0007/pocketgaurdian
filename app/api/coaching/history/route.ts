import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://pocketgaurdian.onrender.com"}/api/coaching/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch coaching history")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching coaching history:", error)
    return NextResponse.json({ error: "Failed to fetch coaching history" }, { status: 500 })
  }
}
