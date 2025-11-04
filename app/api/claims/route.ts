import { type NextRequest, NextResponse } from "next/server"
import { claimsData } from "@/lib/data"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get("status")

  if (status && status !== "all") {
    const filtered = claimsData.filter((c) => c.status === status)
    return NextResponse.json(filtered)
  }

  return NextResponse.json(claimsData)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Generate new claim ID
    const claimCount = claimsData.length + 1
    const newClaimId = `CLM-2024-${String(claimCount).padStart(3, "0")}`

    // Create new claim
    const newClaim = {
      id: newClaimId,
      patientId: body.patientId,
      patientName: `${body.firstName} ${body.lastName}`,
      status: "pending",
      type: body.claimType,
      provider: body.provider,
      amount: body.amount,
      submitted: new Date().toLocaleDateString("en-GB"),
      dob: body.dob,
      serviceDate: body.serviceDate,
      diagnosis: body.diagnosis,
      notes: body.notes || "",
      timeline: [
        { status: "Claim submitted", date: new Date().toLocaleDateString("en-GB"), completed: true },
        { status: "Documents verified by AI", date: "", completed: false },
        { status: "Under review by claim handler", date: "", completed: false },
        { status: "Approved for payment", date: "", completed: false },
        { status: "Payment processed", date: "", completed: false },
      ],
      documents: [],
    }

    claimsData.push(newClaim)
    return NextResponse.json(newClaim, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create claim" }, { status: 500 })
  }
}
