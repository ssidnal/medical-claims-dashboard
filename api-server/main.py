from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

app = FastAPI(title="Medical Claims API", version="1.0.0")

# CORS configuration to allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class TimelineItem(BaseModel):
    status: str
    date: str
    completed: bool

class Document(BaseModel):
    name: str
    size: str
    uploadDate: str

class Claim(BaseModel):
    id: str
    patientId: str
    patientName: str
    status: str
    type: str
    provider: str
    amount: float
    submitted: str

class ClaimDetail(BaseModel):
    id: str
    patientId: str
    patientName: str
    status: str
    dob: str
    type: str
    serviceDate: str
    provider: str
    amount: float
    diagnosis: str
    notes: str
    timeline: List[TimelineItem]
    documents: List[Document]

class NewClaimRequest(BaseModel):
    firstName: str
    lastName: str
    dob: str
    patientId: str
    claimType: str
    serviceDate: str
    provider: str
    amount: float
    diagnosis: str
    notes: Optional[str] = ""

class Stats(BaseModel):
    total: int
    approved: int
    pending: int
    rejected: int

# Mock Database
claims_db = [
    {
        "id": "CLM-2024-001",
        "patientId": "PAT-123456",
        "patientName": "Sarah Johnson",
        "status": "approved",
        "type": "Inpatient",
        "provider": "General Hospital",
        "amount": 4500.0,
        "submitted": "15/01/2024",
        "dob": "15/03/1985",
        "serviceDate": "10/01/2024",
        "diagnosis": "Appendectomy - Emergency surgical removal of inflamed appendix",
        "notes": "Patient presented with acute abdominal pain. Surgery performed successfully with no complications.",
        "timeline": [
            {"status": "Claim submitted", "date": "15/01/2024", "completed": True},
            {"status": "Documents verified by AI", "date": "16/01/2024", "completed": True},
            {"status": "Under review by claim handler", "date": "17/01/2024", "completed": True},
            {"status": "Approved for payment", "date": "18/01/2024", "completed": True},
            {"status": "Payment processed", "date": "20/01/2024", "completed": False},
        ],
        "documents": [
            {"name": "Medical_Report.pdf", "size": "2.4 MB", "uploadDate": "15/01/2024"},
            {"name": "Lab_Results.pdf", "size": "1.8 MB", "uploadDate": "15/01/2024"},
            {"name": "Invoice.pdf", "size": "856 KB", "uploadDate": "15/01/2024"},
        ],
    },
    {
        "id": "CLM-2024-002",
        "patientId": "PAT-789012",
        "patientName": "Michael Chen",
        "status": "pending",
        "type": "Outpatient",
        "provider": "City Clinic",
        "amount": 850.0,
        "submitted": "14/01/2024",
        "dob": "22/07/1990",
        "serviceDate": "12/01/2024",
        "diagnosis": "Routine checkup and blood work",
        "notes": "Annual physical examination with standard lab tests.",
        "timeline": [
            {"status": "Claim submitted", "date": "14/01/2024", "completed": True},
            {"status": "Documents verified by AI", "date": "15/01/2024", "completed": True},
            {"status": "Under review by claim handler", "date": "16/01/2024", "completed": False},
            {"status": "Approved for payment", "date": "", "completed": False},
            {"status": "Payment processed", "date": "", "completed": False},
        ],
        "documents": [
            {"name": "Checkup_Report.pdf", "size": "1.2 MB", "uploadDate": "14/01/2024"},
        ],
    },
    {
        "id": "CLM-2024-003",
        "patientId": "PAT-345678",
        "patientName": "Emma Williams",
        "status": "under-review",
        "type": "Emergency",
        "provider": "Regional Medical Center",
        "amount": 2300.0,
        "submitted": "13/01/2024",
        "dob": "10/11/1978",
        "serviceDate": "11/01/2024",
        "diagnosis": "Fractured wrist - Emergency treatment and casting",
        "notes": "Patient fell and sustained wrist fracture. X-ray confirmed, cast applied.",
        "timeline": [
            {"status": "Claim submitted", "date": "13/01/2024", "completed": True},
            {"status": "Documents verified by AI", "date": "14/01/2024", "completed": True},
            {"status": "Under review by claim handler", "date": "15/01/2024", "completed": True},
            {"status": "Approved for payment", "date": "", "completed": False},
            {"status": "Payment processed", "date": "", "completed": False},
        ],
        "documents": [
            {"name": "X-Ray_Results.pdf", "size": "3.1 MB", "uploadDate": "13/01/2024"},
            {"name": "Treatment_Summary.pdf", "size": "980 KB", "uploadDate": "13/01/2024"},
        ],
    },
    {
        "id": "CLM-2024-004",
        "patientId": "PAT-901234",
        "patientName": "James Rodriguez",
        "status": "rejected",
        "type": "Outpatient",
        "provider": "Community Health",
        "amount": 450.0,
        "submitted": "12/01/2024",
        "dob": "05/02/1995",
        "serviceDate": "10/01/2024",
        "diagnosis": "Cosmetic consultation",
        "notes": "Elective cosmetic procedure not covered by insurance policy.",
        "timeline": [
            {"status": "Claim submitted", "date": "12/01/2024", "completed": True},
            {"status": "Documents verified by AI", "date": "13/01/2024", "completed": True},
            {"status": "Under review by claim handler", "date": "14/01/2024", "completed": True},
            {"status": "Rejected - Not covered", "date": "15/01/2024", "completed": True},
            {"status": "Payment processed", "date": "", "completed": False},
        ],
        "documents": [
            {"name": "Consultation_Notes.pdf", "size": "650 KB", "uploadDate": "12/01/2024"},
        ],
    },
    {
        "id": "CLM-2024-005",
        "patientId": "PAT-567890",
        "patientName": "Lisa Anderson",
        "status": "pending",
        "type": "Inpatient",
        "provider": "University Hospital",
        "amount": 6200.0,
        "submitted": "11/01/2024",
        "dob": "18/09/1982",
        "serviceDate": "08/01/2024",
        "diagnosis": "Pneumonia treatment - 3 day hospital stay",
        "notes": "Patient admitted with severe pneumonia. IV antibiotics administered, condition improved.",
        "timeline": [
            {"status": "Claim submitted", "date": "11/01/2024", "completed": True},
            {"status": "Documents verified by AI", "date": "12/01/2024", "completed": False},
            {"status": "Under review by claim handler", "date": "", "completed": False},
            {"status": "Approved for payment", "date": "", "completed": False},
            {"status": "Payment processed", "date": "", "completed": False},
        ],
        "documents": [
            {"name": "Hospital_Admission.pdf", "size": "2.8 MB", "uploadDate": "11/01/2024"},
            {"name": "Discharge_Summary.pdf", "size": "1.5 MB", "uploadDate": "11/01/2024"},
        ],
    },
]

# API Endpoints

@app.get("/")
def read_root():
    return {"message": "Medical Claims API", "version": "1.0.0"}

@app.get("/api/claims", response_model=List[Claim])
def get_claims(status: Optional[str] = None):
    """Get all claims, optionally filtered by status"""
    if status and status != "all":
        filtered_claims = [c for c in claims_db if c["status"] == status]
        return filtered_claims
    return claims_db

@app.get("/api/claims/{claim_id}", response_model=ClaimDetail)
def get_claim_by_id(claim_id: str):
    """Get a specific claim by ID"""
    claim = next((c for c in claims_db if c["id"] == claim_id), None)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim

@app.post("/api/claims", response_model=Claim)
def create_claim(claim: NewClaimRequest):
    """Create a new claim"""
    # Generate new claim ID
    claim_count = len(claims_db) + 1
    new_claim_id = f"CLM-2024-{str(claim_count).zfill(3)}"
    
    # Create new claim object
    new_claim = {
        "id": new_claim_id,
        "patientId": claim.patientId,
        "patientName": f"{claim.firstName} {claim.lastName}",
        "status": "pending",
        "type": claim.claimType,
        "provider": claim.provider,
        "amount": claim.amount,
        "submitted": datetime.now().strftime("%d/%m/%Y"),
        "dob": claim.dob,
        "serviceDate": claim.serviceDate,
        "diagnosis": claim.diagnosis,
        "notes": claim.notes,
        "timeline": [
            {"status": "Claim submitted", "date": datetime.now().strftime("%d/%m/%Y"), "completed": True},
            {"status": "Documents verified by AI", "date": "", "completed": False},
            {"status": "Under review by claim handler", "date": "", "completed": False},
            {"status": "Approved for payment", "date": "", "completed": False},
            {"status": "Payment processed", "date": "", "completed": False},
        ],
        "documents": [],
    }
    
    claims_db.append(new_claim)
    return new_claim

@app.get("/api/stats", response_model=Stats)
def get_stats():
    """Get claims statistics"""
    total = len(claims_db)
    approved = len([c for c in claims_db if c["status"] == "approved"])
    pending = len([c for c in claims_db if c["status"] == "pending"])
    rejected = len([c for c in claims_db if c["status"] == "rejected"])
    
    return {
        "total": total,
        "approved": approved,
        "pending": pending,
        "rejected": rejected,
    }

@app.put("/api/claims/{claim_id}/status")
def update_claim_status(claim_id: str, status: str):
    """Update claim status"""
    claim = next((c for c in claims_db if c["id"] == claim_id), None)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    claim["status"] = status
    return {"message": "Status updated successfully", "claim": claim}

@app.post("/api/claims/{claim_id}/documents")
async def upload_document(claim_id: str, file: UploadFile = File(...)):
    """Upload a document for a claim"""
    claim = next((c for c in claims_db if c["id"] == claim_id), None)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    # Mock document upload
    new_doc = {
        "name": file.filename,
        "size": "1.2 MB",  # Mock size
        "uploadDate": datetime.now().strftime("%d/%m/%Y"),
    }
    
    claim["documents"].append(new_doc)
    return {"message": "Document uploaded successfully", "document": new_doc}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
