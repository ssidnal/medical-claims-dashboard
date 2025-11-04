import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Clock, Download, FileText } from "lucide-react"
import { claimsData } from "@/lib/data"

function StatusBadge({ status }: { status: string }) {
  const styles = {
    approved: "bg-success text-success-foreground",
    pending: "bg-warning text-warning-foreground",
    "under-review": "bg-info text-info-foreground",
    rejected: "bg-destructive text-destructive-foreground",
  }

  const labels = {
    approved: "Approved",
    pending: "Pending",
    "under-review": "Under Review",
    rejected: "Rejected",
  }

  const icons = {
    approved: <CheckCircle2 className="h-4 w-4" />,
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}
    >
      {status === "approved" && icons.approved}
      {labels[status as keyof typeof labels]}
    </span>
  )
}

export default function ClaimDetailPage({ params }: { params: { id: string } }) {
  const claimData = claimsData.find((c) => c.id === params.id)

  if (!claimData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="border-border">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">Claim Not Found</h2>
            <p className="text-muted-foreground mb-4">The claim you're looking for doesn't exist.</p>
            <Link href="/">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
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
            <span className="text-sm">Back to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Patient Header */}
        <Card className="border-border mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">{claimData.patientName}</h1>
              <StatusBadge status={claimData.status} />
            </div>
            <p className="text-muted-foreground mt-2">
              Claim ID: {claimData.id} • Patient ID: {claimData.patientId}
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Claim Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Claim Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Patient Name</p>
                    <p className="text-base font-medium text-foreground">{claimData.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date of Birth</p>
                    <p className="text-base font-medium text-foreground">{claimData.dob}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Claim Type</p>
                    <p className="text-base font-medium text-foreground">{claimData.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Service Date</p>
                    <p className="text-base font-medium text-foreground">{claimData.serviceDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Healthcare Provider</p>
                    <p className="text-base font-medium text-foreground">{claimData.provider}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Claim Amount</p>
                    <p className="text-base font-medium text-primary">${claimData.amount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Diagnosis/Treatment</p>
                  <p className="text-base font-medium text-foreground">{claimData.diagnosis}</p>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Additional Notes</p>
                  <p className="text-base text-foreground">{claimData.notes}</p>
                </div>
              </CardContent>
            </Card>

            {/* Supporting Documents */}
            <Card className="border-border">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-2">Supporting Documents</h2>
                <p className="text-sm text-muted-foreground mb-6">View and download claim-related documents</p>

                <div className="space-y-3">
                  {claimData.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.size} • Uploaded {doc.uploadDate}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Processing Timeline */}
          <div>
            <Card className="border-border">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-2">Processing Timeline</h2>
                <p className="text-sm text-muted-foreground mb-6">Track your claim's progress</p>

                <div className="space-y-6">
                  {claimData.timeline.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            item.completed ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.completed ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </div>
                        {index < claimData.timeline.length - 1 && (
                          <div className={`w-0.5 h-12 ${item.completed ? "bg-success" : "bg-border"}`} />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <p
                          className={`text-sm font-medium ${
                            item.completed ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {item.status}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
