import { type NextRequest, NextResponse } from "next/server"

const FLASK_APP_URL = process.env.FLASK_APP_URL || "http://localhost:8000"

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")
  const searchParams = request.nextUrl.searchParams.toString()
  const url = `${FLASK_APP_URL}/${path}${searchParams ? `?${searchParams}` : ""}`

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[v0] Proxy error:", error)
    return NextResponse.json({ error: "Failed to fetch from FastAPI server" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")
  const url = `${FLASK_APP_URL}/${path}`

  try {
    const body = await request.json()
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[v0] Proxy error:", error)
    return NextResponse.json({ error: "Failed to post to FastAPI server" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")
  const searchParams = request.nextUrl.searchParams.toString()
  const url = `${FLASK_APP_URL}/${path}${searchParams ? `?${searchParams}` : ""}`

  try {
    const body = await request.json()
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[v0] Proxy error:", error)
    return NextResponse.json({ error: "Failed to update on FastAPI server" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")
  const url = `${FLASK_APP_URL}/${path}`

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[v0] Proxy error:", error)
    return NextResponse.json({ error: "Failed to delete on FastAPI server" }, { status: 500 })
  }
}
