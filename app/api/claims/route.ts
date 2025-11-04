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
    const contentType = request.headers.get("content-type")
    let body: any
    let files: File[] = []

    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData()
      body = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        dob: formData.get("dob"),
        patientId: formData.get("patientId"),
        claimType: formData.get("claimType"),
        serviceDate: formData.get("serviceDate"),
        provider: formData.get("provider"),
        amount: formData.get("amount"),
        diagnosis: formData.get("diagnosis"),
        notes: formData.get("notes"),
        analysisResult: formData.get("analysisResult") ? JSON.parse(formData.get("analysisResult") as string) : null,
      }

      // Extract files
      const documents = formData.getAll("documents")
      files = documents.filter((doc): doc is File => doc instanceof File)
    } else {
      body = await request.json()
    }

    // Generate new claim ID
    const claimCount = claimsData.length + 1
    const newClaimId = `CLM-2024-${String(claimCount).padStart(3, "0")}`

    const newClaim = {
      id: newClaimId,
      patientId: body.patientId,
      patientName: `${body.firstName} ${body.lastName}`,
      status: body.analysisResult?.status || "pending",
      type: body.claimType,
      provider: body.provider,
      amount: body.amount,
      submitted: new Date().toLocaleDateString("en-GB"),
      dob: body.dob,
      serviceDate: body.serviceDate,
      diagnosis: body.diagnosis,
      notes: body.notes || "",
      // Add AI analysis data
      aiAnalysis: body.analysisResult
        ? {
            confidence: body.analysisResult.confidence || 0,
            completeness: body.analysisResult.completeness || 0,
            decisionReasoning: body.analysisResult.decision_reasoning || "",
            detailedAnalysis: body.analysisResult.detailed_analysis || "",
            improvementSuggestions: body.analysisResult.improvement_suggestions || [],
            extractedData: body.analysisResult.extracted_data || {},
          }
        : null,
      timeline: [
        { status: "Claim submitted", date: new Date().toLocaleDateString("en-GB"), completed: true },
        {
          status: "Documents verified by AI",
          date: body.analysisResult ? new Date().toLocaleDateString("en-GB") : "",
          completed: !!body.analysisResult,
        },
        { status: "Under review by claim handler", date: "", completed: false },
        { status: "Approved for payment", date: "", completed: false },
        { status: "Payment processed", date: "", completed: false },
      ],
      documents: files.map((file) => ({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedDate: new Date().toLocaleDateString("en-GB"),
      })),
    }

    claimsData.push(newClaim)
    return NextResponse.json(newClaim, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating claim:", error)
    return NextResponse.json({ error: "Failed to create claim" }, { status: 500 })
  }
}
