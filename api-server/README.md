# Medical Claims API Server

FastAPI backend for the Medical Claims Management System.

## Setup

1. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

2. Run the server:
\`\`\`bash
python main.py
\`\`\`

Or using uvicorn directly:
\`\`\`bash
uvicorn main:app --reload --port 8000
\`\`\`

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Available Endpoints

- `GET /api/claims` - Get all claims (optional ?status= filter)
- `GET /api/claims/{claim_id}` - Get specific claim details
- `POST /api/claims` - Create a new claim
- `GET /api/stats` - Get claims statistics
- `PUT /api/claims/{claim_id}/status` - Update claim status
- `POST /api/claims/{claim_id}/documents` - Upload document for a claim

## CORS Configuration

The API is configured to accept requests from:
- http://localhost:3000
- http://127.0.0.1:3000

Modify the `allow_origins` list in `main.py` if you need to add more origins.
