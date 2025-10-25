import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "https://pocketgaurdian.onrender.com"}/api/coaching/get-advice`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      },
    )

    if (!response.ok) {
      throw new Error("Failed to get coaching advice")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error getting coaching advice:", error)
    return NextResponse.json({ error: "Failed to get coaching advice" }, { status: 500 })
  }
}
