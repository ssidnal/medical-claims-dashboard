import { type NextRequest, NextResponse } from "next/server"
import { claimsData } from "@/lib/data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const claim = claimsData.find((c) => c.id === params.id)

  if (!claim) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 })
  }

  return NextResponse.json(claim)
}
