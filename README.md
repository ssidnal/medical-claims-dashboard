# Medical Claims Management System

A full-stack medical claims management application with FastAPI backend and Next.js frontend.

## Overview

This application provides a comprehensive dashboard for managing medical claims, including:
- Viewing all claims with statistics
- Detailed claim information with processing timeline
- Submitting new medical claims
- Document upload and management

## Architecture

- **Frontend**: Next.js 16 with React Server Components, TypeScript, and Tailwind CSS
- **Backend**: FastAPI (Python) with RESTful API
- **Proxy**: Next.js API routes proxy requests to FastAPI backend

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **pnpm** (v8 or higher) - Install via npm: `npm install -g pnpm`
- **Python** (v3.8 or higher) - [Download here](https://www.python.org/downloads/)
- **pip** (Python package manager) - Usually comes with Python

## Getting Started

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd medical-claims-dashboard
```

### Step 2: Set Up the Backend (FastAPI)

1. Navigate to the API server directory:
   ```bash
   cd api-server
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **On macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```
   - **On Windows**:
     ```bash
     venv\Scripts\activate
     ```

4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Start the FastAPI server:
   ```bash
   python main.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

   The FastAPI server will run on `http://localhost:8000`

6. Verify the API is running by visiting:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Step 3: Set Up the Frontend (Next.js)

1. Open a new terminal window and navigate to the project root:
   ```bash
   cd medical-claims-dashboard
   ```

2. Install dependencies using pnpm:
   ```bash
   pnpm install
   ```

3. Create environment variables file (optional):
   ```bash
   cp .env.example .env.local
   ```
   
   Or create `.env.local` manually with:
   ```env
   FASTAPI_URL=http://localhost:8000
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

   The Next.js app will run on `http://localhost:3000`

### Step 4: Access the Application

Once both servers are running:

- **Frontend**: Open your browser and navigate to http://localhost:3000
- **Backend API Documentation**: http://localhost:8000/docs

## Available Scripts

### Frontend (Next.js)

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint to check code quality

### Backend (FastAPI)

- `python main.py` - Start the FastAPI server
- `uvicorn main:app --reload --port 8000` - Start with auto-reload enabled

## API Endpoints

The FastAPI backend provides the following endpoints:

- `GET /api/claims` - Get all claims (optional ?status= filter)
- `GET /api/claims/{claim_id}` - Get specific claim details
- `POST /api/claims` - Create a new claim
- `GET /api/stats` - Get claims statistics
- `PUT /api/claims/{claim_id}/status` - Update claim status
- `POST /api/claims/{claim_id}/documents` - Upload document for a claim

For detailed API documentation, visit http://localhost:8000/docs when the server is running.

## Project Structure

```
medical-claims-dashboard/
├── api-server/          # FastAPI backend
│   ├── main.py         # Main FastAPI application
│   ├── requirements.txt # Python dependencies
│   └── README.md       # API server documentation
├── app/                # Next.js app directory
│   ├── api/            # API routes
│   │   ├── proxy/      # Proxy routes to FastAPI
│   │   ├── claims/     # Claims API endpoints
│   │   └── stats/      # Statistics API endpoint
│   ├── claims/         # Claims pages
│   │   ├── [id]/       # Claim detail page
│   │   └── new/        # New claim submission page
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Dashboard home page
├── components/         # React components
│   ├── ui/             # UI components (shadcn/ui)
│   └── theme-provider.tsx
├── lib/                # Utility functions
│   ├── data.ts         # Mock data
│   └── utils.ts        # Helper functions
├── hooks/              # Custom React hooks
├── public/             # Static assets
├── styles/             # Global styles
├── package.json        # Node.js dependencies
├── pnpm-lock.yaml      # pnpm lock file
├── next.config.mjs     # Next.js configuration
└── tsconfig.json       # TypeScript configuration
```

## Features

- **Claims Dashboard**: View all claims with statistics and filtering
- **Claim Details**: View detailed claim information with processing timeline
- **Submit New Claim**: Form to submit new medical claims with validation
- **API Proxy**: Next.js proxies requests to FastAPI backend for seamless integration
- **Responsive Design**: Modern UI that works on desktop and mobile devices
- **Dark Mode**: Theme support with light/dark mode toggle

## Troubleshooting

### Port Already in Use

If port 8000 or 3000 is already in use:

**For FastAPI (port 8000):**
```bash
uvicorn main:app --reload --port 8001
```
Then update `FASTAPI_URL` in `.env.local` to `http://localhost:8001`

**For Next.js (port 3000):**
```bash
pnpm dev --port 3001
```

### Python Virtual Environment Issues

If you encounter Python package conflicts:
```bash
# Remove existing virtual environment
rm -rf venv  # On macOS/Linux
# or
rmdir /s venv  # On Windows

# Create a new one
python -m venv venv
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate  # On Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### pnpm Not Found

If pnpm is not installed:
```bash
npm install -g pnpm
```

Alternatively, you can use npm or yarn, but pnpm is recommended for this project.

### CORS Issues

If you encounter CORS errors, ensure:
1. The FastAPI server is running on port 8000
2. The Next.js app is running on port 3000
3. Both servers are running simultaneously

The FastAPI server is configured to allow requests from `http://localhost:3000` and `http://127.0.0.1:3000`.

## Environment Variables

Create a `.env.local` file in the root directory:

```env
FASTAPI_URL=http://localhost:8000
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary.
