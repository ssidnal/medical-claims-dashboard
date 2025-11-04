"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Upload, X, FileText, Loader2 } from "lucide-react"

export default function NewClaimPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    patientId: "",
    claimType: "",
    serviceDate: "",
    provider: "",
    amount: "",
    diagnosis: "",
    notes: "",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
    setAnalysisResult(null)
  }

  const analyzeDocument = async () => {
    if (files.length === 0) {
      toast({
        title: "No Document",
        description: "Please upload a document first",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append("file", files[0])
      formData.append("claim_type", "medical")

      const response = await fetch("/api/proxy/analyze", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to analyze document")
      }

      const result = await response.json()
      setAnalysisResult(result)

      // Auto-fill form with extracted data
      if (result.extracted_data) {
        setFormData((prev) => ({
          ...prev,
          firstName: result.extracted_data.patient_name?.split(" ")[0] || prev.firstName,
          lastName: result.extracted_data.patient_name?.split(" ").slice(1).join(" ") || prev.lastName,
          patientId: result.extracted_data.policy_number || prev.patientId,
          amount: result.extracted_data.billed_amount?.toString() || prev.amount,
          serviceDate: result.extracted_data.service_date || prev.serviceDate,
        }))
      }

      toast({
        title: "Analysis Complete",
        description: "Document analyzed successfully. Form fields have been auto-filled.",
      })
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze document. Please try again or fill the form manually.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, claimType: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.dob ||
      !formData.patientId ||
      !formData.claimType ||
      !formData.serviceDate ||
      !formData.provider ||
      !formData.amount ||
      !formData.diagnosis
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields marked with *",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const submitData = new FormData()
      submitData.append("firstName", formData.firstName)
      submitData.append("lastName", formData.lastName)
      submitData.append("dob", formData.dob)
      submitData.append("patientId", formData.patientId)
      submitData.append("claimType", formData.claimType)
      submitData.append("serviceDate", formData.serviceDate)
      submitData.append("provider", formData.provider)
      submitData.append("amount", formData.amount)
      submitData.append("diagnosis", formData.diagnosis)
      submitData.append("notes", formData.notes)

      // Add analysis result if available
      if (analysisResult) {
        submitData.append("analysisResult", JSON.stringify(analysisResult))
      }

      // Add files
      files.forEach((file) => {
        submitData.append("documents", file)
      })

      const response = await fetch("/api/claims", {
        method: "POST",
        body: submitData,
      })

      if (!response.ok) {
        throw new Error("Failed to submit claim")
      }

      const newClaim = await response.json()

      toast({
        title: "Success!",
        description: `Claim ${newClaim.id} has been submitted successfully.`,
      })

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit claim. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <Card className="border-border">
          <CardContent className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Submit New Claim</h1>
              <p className="text-muted-foreground">
                Fill out the form below to submit a new medical claim. All fields marked with * are required.
              </p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border">
                  Upload Claim Document
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload PDF or image files for AI-powered analysis using GPT-4 Mini
                </p>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      id="fileUpload"
                      className="hidden"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer">
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm font-medium text-foreground mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                    </label>
                  </div>

                  {files.length > 0 && (
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-green-500/10 rounded flex items-center justify-center">
                              <FileText className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {files.length > 0 && (
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        onClick={analyzeDocument}
                        disabled={isAnalyzing}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Analyze with AI
                          </>
                        )}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setFiles([])}>
                        Clear File
                      </Button>
                    </div>
                  )}

                  {analysisResult && (
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                            Document Analyzed Successfully
                          </h3>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Confidence: {analysisResult.confidence}% | Completeness: {analysisResult.completeness}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Patient Information */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border">
                  Patient Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input id="dob" type="date" value={formData.dob} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient ID *</Label>
                    <Input
                      id="patientId"
                      placeholder="PAT-123456"
                      value={formData.patientId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Claim Details */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border">
                  Claim Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="claimType">Claim Type *</Label>
                    <Select value={formData.claimType} onValueChange={handleSelectChange} required>
                      <SelectTrigger id="claimType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inpatient">Inpatient</SelectItem>
                        <SelectItem value="outpatient">Outpatient</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="preventive">Preventive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceDate">Service Date *</Label>
                    <Input
                      id="serviceDate"
                      type="date"
                      value={formData.serviceDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provider">Healthcare Provider *</Label>
                    <Input
                      id="provider"
                      placeholder="General Hospital"
                      value={formData.provider}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Claim Amount ($) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="1500.00"
                      step="0.01"
                      value={formData.amount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-6">
                  <Label htmlFor="diagnosis">Diagnosis/Treatment Description *</Label>
                  <Textarea
                    id="diagnosis"
                    placeholder="Describe the medical condition and treatment received..."
                    rows={5}
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border">
                  Additional Notes
                </h2>
                <Textarea
                  id="notes"
                  placeholder="Add any additional information or notes about this claim..."
                  rows={4}
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Claim"}
                </Button>
                <Link href="/" className="flex-1">
                  <Button type="button" variant="outline" className="w-full bg-transparent" disabled={isSubmitting}>
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
