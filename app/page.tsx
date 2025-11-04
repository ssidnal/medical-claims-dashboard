import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, FileText, CheckCircle2, Clock, XCircle } from "lucide-react"
import { claimsData, getStats } from "@/lib/data"

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

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}
    >
      {status === "approved" && <CheckCircle2 className="h-3 w-3" />}
      {labels[status as keyof typeof labels]}
    </span>
  )
}

export default function ClaimsDashboard() {
  const claims = claimsData
  const stats = getStats()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <Link href="/claims/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">+ New Claim</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Claims Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage all medical claims in one place</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Total Claims</p>
                <p className="text-4xl font-bold text-foreground">{stats.total}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <FileText className="h-4 w-4" />
                  <span>All submissions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-4xl font-bold text-success">{stats.approved}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Processed successfully</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-4xl font-bold text-warning">{stats.pending}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <Clock className="h-4 w-4" />
                  <span>Awaiting action</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-4xl font-bold text-destructive">{stats.rejected}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <XCircle className="h-4 w-4" />
                  <span>Requires attention</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="border-border mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by patient name, claim ID, or patient ID..." className="pl-10" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Claims List */}
        <div className="space-y-4">
          {claims.map((claim) => (
            <Card key={claim.id} className="border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{claim.patientName}</h3>
                      <StatusBadge status={claim.status} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Claim ID: {claim.id} • Patient ID: {claim.patientId}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Type</p>
                        <p className="text-sm font-medium text-foreground">{claim.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Provider</p>
                        <p className="text-sm font-medium text-foreground">{claim.provider}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Amount</p>
                        <p className="text-sm font-medium text-primary">${claim.amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Submitted</p>
                        <p className="text-sm font-medium text-foreground">{claim.submitted}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Link href={`/claims/${claim.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
