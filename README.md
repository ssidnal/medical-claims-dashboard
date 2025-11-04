# Medical Claims Management System

A full-stack medical claims management application with FastAPI backend and Next.js frontend.

## Architecture

- **Frontend**: Next.js 16 with React Server Components
- **Backend**: FastAPI (Python)
- **Proxy**: Next.js API routes proxy requests to FastAPI

## Getting Started

### 1. Start the FastAPI Backend

\`\`\`bash
cd api-server
pip install -r requirements.txt
python main.py
\`\`\`

The FastAPI server will run on `http://localhost:8000`

### 2. Start the Next.js Frontend

\`\`\`bash
npm install
npm run dev
\`\`\`

The Next.js app will run on `http://localhost:3000`

## API Documentation

Once the FastAPI server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Features

- **Claims Dashboard**: View all claims with statistics
- **Claim Details**: View detailed claim information with processing timeline
- **Submit New Claim**: Form to submit new medical claims
- **API Proxy**: Next.js proxies requests to FastAPI backend

## Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`
FASTAPI_URL=http://localhost:8000
\`\`\`

## Project Structure

\`\`\`
├── api-server/          # FastAPI backend
│   ├── main.py         # Main FastAPI application
│   ├── requirements.txt
│   └── README.md
├── app/                # Next.js app directory
│   ├── api/proxy/      # Proxy routes to FastAPI
│   ├── claims/         # Claims pages
│   └── page.tsx        # Dashboard
└── components/         # React components
