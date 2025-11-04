# Medical Claims Management System

A full-stack medical claims management application with Flask backend and Next.js frontend. This dashboard allows you to view, manage, and submit medical claims with a modern, responsive user interface.

## 🏗️ Architecture

- **Frontend**: Next.js 16 with React Server Components, TypeScript, and Tailwind CSS
- **Backend**: Flask (Python) with RESTful API
- **Proxy**: Next.js API routes proxy requests to Flask backend
- **UI Components**: Radix UI components with custom styling

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://www.python.org/downloads/)
- **pnpm** (Package manager) - Install via: `npm install -g pnpm`
  - Or use npm/npx if you prefer

## 🚀 Getting Started

Follow these steps to set up and run the project locally:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd medical-claims-dashboard
```

### 2. Backend Setup (Flask)

#### Create Virtual Environment (Recommended)

```bash
cd api-server
python -m venv venv
```

Activate the virtual environment:

**On macOS/Linux:**
```bash
source venv/bin/activate
```

**On Windows:**
```bash
venv\Scripts\activate
```

#### Install Python Dependencies

```bash
pip install -r requirements.txt
```

**Note**: If you skip the virtual environment step, install dependencies globally (not recommended):
```bash
pip install -r requirements.txt
```

#### Start the Flask Server

```bash
python app.py
```

The Flask server will start on `http://localhost:8000`

You can verify it's running by visiting:
- API Root: http://localhost:8000
- Health Check: http://localhost:8000/
- API Status: http://localhost:8000/api/status

### 3. Frontend Setup (Next.js)

#### Install Dependencies

Open a new terminal window and navigate to the project root:

```bash
cd /path/to/medical-claims-dashboard
pnpm install
```

**Alternative**: If you don't have pnpm, you can use npm:

```bash
npm install
```

#### Start the Development Server

```bash
pnpm dev
```

Or with npm:

```bash
npm run dev
```

The Next.js application will start on `http://localhost:3000`

### 4. Environment Variables (Optional)

If you need to configure the Flask backend URL, create a `.env.local` file in the root directory:

```env
FLASK_URL=http://localhost:8000
```

## 🎯 Running Both Servers

You need to run both the backend and frontend servers simultaneously:

**Terminal 1 - Backend:**
```bash
cd api-server
python app.py
```

**Terminal 2 - Frontend:**
```bash
pnpm dev
```

Or use npm:
```bash
npm run dev
```

## 📁 Project Structure

```
medical-claims-dashboard/
├── api-server/              # Flask backend
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   ├── routes/             # API route blueprints
│   │   ├── claims_routes.py
│   │   ├── eligibility_routes.py
│   │   └── recommendations_routes.py
│   ├── utils/              # Utility functions
│   └── README.md
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── proxy/        # Proxy routes to Flask
│   │   ├── claims/       # Claims API endpoints
│   │   └── stats/        # Statistics API endpoints
│   ├── claims/           # Claims pages
│   │   ├── [id]/        # Dynamic claim detail page
│   │   └── new/         # New claim submission page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Dashboard homepage
├── components/           # React components
│   ├── ui/              # UI component library
│   └── theme-provider.tsx
├── lib/                 # Utility functions and data
├── hooks/               # Custom React hooks
├── public/              # Static assets
├── package.json         # Node.js dependencies
├── next.config.mjs      # Next.js configuration
└── tsconfig.json        # TypeScript configuration
```

## ✨ Features

- **📊 Claims Dashboard**: View all claims with statistics and filtering
- **📋 Claim Details**: View detailed claim information with processing timeline
- **➕ Submit New Claim**: Form to submit new medical claims
- **📈 Statistics**: View claims statistics (total, approved, pending, rejected)
- **🔄 API Proxy**: Next.js proxies requests to Flask backend
- **🎨 Modern UI**: Responsive design with dark mode support

## 🛠️ Development Scripts

### Frontend Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

### Backend

The Flask server runs when executing `python app.py`. For production, you can run:

```bash
flask run --host 0.0.0.0 --port 8000
```

Or using gunicorn:
```bash
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

## 🌐 API Endpoints

Once the Flask server is running, the following endpoints are available:

- `GET /` - Health check endpoint
- `GET /api/status` - API status and available endpoints
- `GET /api/claims/*` - Claims-related endpoints (see routes/claims_routes.py)
- `GET /api/eligibility/*` - Eligibility check endpoints (see routes/eligibility_routes.py)
- `GET /api/recommendations/*` - Recommendations endpoints (see routes/recommendations_routes.py)

Check the API status endpoint for a full list of available endpoints: http://localhost:8000/api/status

## 🐛 Troubleshooting

### Backend Issues

- **Port 8000 already in use**: Change the port in `api-server/app.py` (last line: `app.run(..., port=8000)`) or stop the process using port 8000
- **Python module not found**: Ensure you're in the `api-server` directory and dependencies are installed. Consider using a virtual environment:
  ```bash
  cd api-server
  python -m venv venv
  source venv/bin/activate  # On Windows: venv\Scripts\activate
  pip install -r requirements.txt
  ```
- **CORS errors**: The Flask server has CORS enabled for all domains. If you encounter CORS issues, verify CORS settings in `app.py`

### Frontend Issues

- **Port 3000 already in use**: Next.js will automatically use the next available port (3001, 3002, etc.)
- **Module not found**: Run `pnpm install` or `npm install` again
- **API connection errors**: Ensure the Flask backend is running on port 8000

### General Issues

- **Can't connect to backend**: Verify both servers are running and check the terminal output for any errors
- **Build errors**: Clear `.next` directory and node_modules, then reinstall:
  ```bash
  rm -rf .next node_modules
  pnpm install
  ```

## 📝 Notes

- The backend uses Flask with modular route blueprints for better organization.
- The project uses TypeScript for type safety in the frontend.
- UI components are built with Radix UI and styled with Tailwind CSS.
- Consider using a Python virtual environment to manage dependencies and avoid conflicts.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is private and proprietary.
