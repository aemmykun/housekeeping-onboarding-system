# ============================================================================
# 🏨 Housekeeping Onboarding System - Setup Script
# ============================================================================
# This script automates the complete project initialization and setup
# ============================================================================

param(
    [switch]$SkipDependencies,
    [switch]$SkipMongoDB,
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"
$projectName = "housekeeping-onboarding-system"
$rootPath = $PSScriptRoot

# ============================================================================
# Helper Functions
# ============================================================================

function Write-Header {
    param([string]$Message)
    Write-Host "`n=================================================" -ForegroundColor Cyan
    Write-Host "  $Message" -ForegroundColor Cyan
    Write-Host "=================================================`n" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Blue
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Test-CommandExists {
    param([string]$Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# ============================================================================
# Prerequisites Check
# ============================================================================

function Test-Prerequisites {
    Write-Header "Checking Prerequisites"
    
    $allGood = $true
    
    # Check Node.js
    if (Test-CommandExists "node") {
        $nodeVersion = node --version
        Write-Success "Node.js installed: $nodeVersion"
        
        # Check if version is 18+
        $version = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
        if ($version -lt 18) {
            Write-Warning "Node.js version should be 18 or higher. Current: $nodeVersion"
        }
    } else {
        Write-Error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        $allGood = $false
    }
    
    # Check npm
    if (Test-CommandExists "npm") {
        $npmVersion = npm --version
        Write-Success "npm installed: $npmVersion"
    } else {
        Write-Error "npm is not installed"
        $allGood = $false
    }
    
    # Check MongoDB
    if (-not $SkipMongoDB) {
        if (Test-CommandExists "mongod") {
            Write-Success "MongoDB installed"
        } else {
            Write-Warning "MongoDB not found. Install from https://www.mongodb.com/try/download/community"
            Write-Info "You can skip MongoDB check with -SkipMongoDB flag"
        }
    }
    
    # Check Git
    if (Test-CommandExists "git") {
        $gitVersion = git --version
        Write-Success "Git installed: $gitVersion"
    } else {
        Write-Warning "Git is not installed. Install from https://git-scm.com/"
    }
    
    if (-not $allGood) {
        throw "Prerequisites not met. Please install required software."
    }
    
    Write-Success "All prerequisites satisfied!"
}

# ============================================================================
# Project Structure Creation
# ============================================================================

function New-ProjectStructure {
    Write-Header "Creating Project Structure"
    
    $folders = @(
        "frontend/src/components/Auth",
        "frontend/src/components/Dashboard",
        "frontend/src/components/Modules",
        "frontend/src/components/Gamification",
        "frontend/src/components/AR",
        "frontend/src/components/Social",
        "frontend/src/pages",
        "frontend/src/contexts",
        "frontend/src/utils",
        "frontend/src/styles",
        "frontend/public/images",
        "frontend/public/icons",
        
        "backend/models",
        "backend/routes",
        "backend/middleware",
        "backend/controllers",
        "backend/utils",
        "backend/config",
        "backend/services",
        
        "database/schemas",
        "database/seeders",
        "database/migrations",
        
        "mobile/src/components",
        "mobile/src/screens",
        "mobile/src/navigation",
        
        "docs/api",
        "docs/deployment",
        "docs/user-guide",
        
        "deployment/docker",
        "deployment/kubernetes",
        
        "tests/unit",
        "tests/integration",
        "tests/e2e",
        
        "scripts"
    )
    
    foreach ($folder in $folders) {
        $fullPath = Join-Path $rootPath $folder
        if (-not (Test-Path $fullPath)) {
            New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
            Write-Success "Created: $folder"
        } else {
            Write-Info "Exists: $folder"
        }
    }
    
    Write-Success "Project structure created successfully!"
}

# ============================================================================
# Configuration Files
# ============================================================================

function New-ConfigurationFiles {
    Write-Header "Creating Configuration Files"
    
    # Root package.json
    $rootPackageJson = @{
        name = $projectName
        version = "1.0.0"
        description = "Interactive Housekeeping Onboarding System"
        private = $true
        workspaces = @("frontend", "backend")
        scripts = @{
            "install-all" = "npm install && cd frontend && npm install && cd ../backend && npm install"
            "dev" = "concurrently `"npm run dev:backend`" `"npm run dev:frontend`""
            "dev:frontend" = "cd frontend && npm start"
            "dev:backend" = "cd backend && npm run dev"
            "build" = "cd frontend && npm run build"
            "test" = "npm run test:backend && npm run test:frontend"
            "test:backend" = "cd backend && npm test"
            "test:frontend" = "cd frontend && npm test"
            "seed" = "cd backend && npm run seed"
            "lint" = "eslint . --ext .js,.jsx"
            "format" = "prettier --write `"**/*.{js,jsx,json,md}`""
        }
        keywords = @("housekeeping", "onboarding", "training", "gamification", "hospitality")
        author = "Your Organization"
        license = "MIT"
        devDependencies = @{
            "concurrently" = "^8.2.2"
            "eslint" = "^8.56.0"
            "prettier" = "^3.1.1"
            "husky" = "^8.0.3"
        }
    }
    
    $rootPackageJson | ConvertTo-Json -Depth 10 | Set-Content "$rootPath/package.json"
    Write-Success "Created: package.json"
    
    # Frontend package.json
    $frontendPackageJson = @{
        name = "frontend"
        version = "1.0.0"
        private = $true
        dependencies = @{
            "react" = "^18.2.0"
            "react-dom" = "^18.2.0"
            "react-router-dom" = "^6.21.0"
            "@mui/material" = "^5.15.0"
            "@mui/icons-material" = "^5.15.0"
            "@emotion/react" = "^11.11.1"
            "@emotion/styled" = "^11.11.0"
            "axios" = "^1.6.2"
            "socket.io-client" = "^4.7.2"
            "chart.js" = "^4.4.1"
            "react-chartjs-2" = "^5.2.0"
            "framer-motion" = "^10.18.0"
            "react-confetti" = "^6.1.0"
        }
        scripts = @{
            "start" = "react-scripts start"
            "build" = "react-scripts build"
            "test" = "react-scripts test"
            "eject" = "react-scripts eject"
        }
        eslintConfig = @{
            extends = @("react-app")
        }
        browserslist = @{
            production = @(">0.2%", "not dead", "not op_mini all")
            development = @("last 1 chrome version", "last 1 firefox version", "last 1 safari version")
        }
    }
    
    $frontendPackageJson | ConvertTo-Json -Depth 10 | Set-Content "$rootPath/frontend/package.json"
    Write-Success "Created: frontend/package.json"
    
    # Backend package.json
    $backendPackageJson = @{
        name = "backend"
        version = "1.0.0"
        description = "Backend API for Housekeeping Onboarding System"
        main = "server.js"
        scripts = @{
            "start" = "node server.js"
            "dev" = "nodemon server.js"
            "test" = "jest --coverage"
            "seed" = "node database/seeders/index.js"
        }
        dependencies = @{
            "express" = "^4.18.2"
            "mongoose" = "^8.0.3"
            "jsonwebtoken" = "^9.0.2"
            "bcryptjs" = "^2.4.3"
            "dotenv" = "^16.3.1"
            "cors" = "^2.8.5"
            "express-validator" = "^7.0.1"
            "socket.io" = "^4.7.2"
            "multer" = "^1.4.5-lts.1"
            "redis" = "^4.6.11"
            "nodemailer" = "^6.9.7"
        }
        devDependencies = @{
            "nodemon" = "^3.0.2"
            "jest" = "^29.7.0"
            "supertest" = "^6.3.3"
        }
    }
    
    $backendPackageJson | ConvertTo-Json -Depth 10 | Set-Content "$rootPath/backend/package.json"
    Write-Success "Created: backend/package.json"
    
    # .env.example
    $envExample = @"
# Database
MONGODB_URI=mongodb://localhost:27017/housekeeping_onboarding
REDIS_URL=redis://localhost:6379

# Server
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000

# File Storage (Optional - for production)
AWS_S3_BUCKET=housekeeping-assets
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Email Service (Optional)
EMAIL_SERVICE_API_KEY=your-email-service-key
EMAIL_FROM=noreply@yourdomain.com

# Push Notifications (Optional)
PUSH_NOTIFICATION_KEY=your-firebase-key

# AR/VR Services (Optional)
AR_SERVICE_URL=https://ar-api.example.com
VR_CONTENT_CDN=https://vr-content.example.com
"@
    
    $envExample | Set-Content "$rootPath/.env.example"
    Write-Success "Created: .env.example"
    
    # .gitignore
    $gitignore = @"
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment
.env
.env.local
.env.production

# Build outputs
frontend/build/
backend/dist/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
*.test.js.snap

# Misc
*.bak
*.tmp
.cache/
"@
    
    $gitignore | Set-Content "$rootPath/.gitignore"
    Write-Success "Created: .gitignore"
    
    # ESLint config
    $eslintrc = @{
        env = @{
            browser = $true
            node = $true
            es2021 = $true
        }
        extends = @("eslint:recommended")
        parserOptions = @{
            ecmaVersion = "latest"
            sourceType = "module"
        }
        rules = @{
            "no-console" = "warn"
            "no-unused-vars" = "warn"
        }
    }
    
    $eslintrc | ConvertTo-Json -Depth 10 | Set-Content "$rootPath/.eslintrc.json"
    Write-Success "Created: .eslintrc.json"
    
    # Prettier config
    $prettierrc = @{
        semi = $true
        trailingComma = "es5"
        singleQuote = $true
        printWidth = 80
        tabWidth = 2
    }
    
    $prettierrc | ConvertTo-Json | Set-Content "$rootPath/.prettierrc.json"
    Write-Success "Created: .prettierrc.json"
}

# ============================================================================
# Install Dependencies
# ============================================================================

function Install-Dependencies {
    if ($SkipDependencies) {
        Write-Warning "Skipping dependency installation (flag set)"
        return
    }
    
    Write-Header "Installing Dependencies"
    
    try {
        Write-Info "Installing root dependencies..."
        npm install --prefix $rootPath
        Write-Success "Root dependencies installed"
        
        Write-Info "Installing frontend dependencies..."
        npm install --prefix "$rootPath/frontend"
        Write-Success "Frontend dependencies installed"
        
        Write-Info "Installing backend dependencies..."
        npm install --prefix "$rootPath/backend"
        Write-Success "Backend dependencies installed"
        
        Write-Success "All dependencies installed successfully!"
    } catch {
        Write-Warning "Failed to install some dependencies. You can run 'npm run install-all' manually."
    }
}

# ============================================================================
# Create Core Files
# ============================================================================

function New-CoreFiles {
    Write-Header "Creating Core Application Files"
    
    # Backend server.js
    $serverJs = @"
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✓ MongoDB connected'))
.catch(err => console.error('✗ MongoDB connection error:', err));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// TODO: Add route imports here
// const authRoutes = require('./routes/auth');
// app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
});

module.exports = app;
"@
    
    $serverJs | Set-Content "$rootPath/backend/server.js"
    Write-Success "Created: backend/server.js"
    
    # Frontend index.html
    $indexHtml = @"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Housekeeping Onboarding System" />
    <title>🏨 Housekeeping Onboarding</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
"@
    
    $indexHtml | Set-Content "$rootPath/frontend/public/index.html"
    Write-Success "Created: frontend/public/index.html"
    
    # Frontend index.js
    $indexJs = @"
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
"@
    
    $indexJs | Set-Content "$rootPath/frontend/src/index.js"
    Write-Success "Created: frontend/src/index.js"
    
    # Frontend App.js
    $appJs = @"
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>🏨 Housekeeping Onboarding System</h1>
            <p>Welcome to your interactive training platform!</p>
          </header>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

function Home() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Getting Started</h2>
      <p>Your application is ready to be developed!</p>
    </div>
  );
}

export default App;
"@
    
    $appJs | Set-Content "$rootPath/frontend/src/App.js"
    Write-Success "Created: frontend/src/App.js"
    
    # Frontend CSS files
    $indexCss = @"
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
"@
    
    $indexCss | Set-Content "$rootPath/frontend/src/index.css"
    Write-Success "Created: frontend/src/index.css"
    
    $appCss = @"
.App {
  min-height: 100vh;
}

.App-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
  color: white;
  text-align: center;
}

.App-header h1 {
  margin: 0;
  font-size: 2.5rem;
}

.App-header p {
  margin-top: 10px;
  font-size: 1.2rem;
  opacity: 0.9;
}
"@
    
    $appCss | Set-Content "$rootPath/frontend/src/App.css"
    Write-Success "Created: frontend/src/App.css"
}

# ============================================================================
# Create README
# ============================================================================

function New-SetupReadme {
    Write-Header "Creating Setup Documentation"
    
    $setupReadme = @"
# 🚀 Setup Complete!

Your Housekeeping Onboarding System has been initialized successfully.

## ✅ What's Been Created

- ✓ Complete project structure (frontend, backend, database)
- ✓ Configuration files (package.json, .env.example, .gitignore)
- ✓ Core application files (server.js, App.js)
- ✓ Development tools (ESLint, Prettier)

## 🎯 Next Steps

### 1. Environment Setup
Copy the example environment file and configure it:
``````
cp .env.example .env
``````
Edit `.env` and update values, especially:
- MONGODB_URI
- JWT_SECRET

### 2. Start MongoDB
Make sure MongoDB is running:
``````
mongod
``````

### 3. Install Dependencies (if not done)
``````
npm run install-all
``````

### 4. Start Development Servers
``````
npm run dev
``````

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### 5. Test the Setup
Open http://localhost:3000 in your browser

## 📂 Project Structure

``````
housekeeping-onboarding-system/
├── frontend/           # React application
├── backend/            # Node.js/Express API
├── database/           # Schemas and seed data
├── mobile/             # React Native (future)
├── docs/               # Documentation
├── deployment/         # Docker & K8s configs
└── tests/              # Test suites
``````

## 🛠️ Available Commands

- \`npm run dev\` - Start development servers
- \`npm run build\` - Build for production
- \`npm test\` - Run all tests
- \`npm run lint\` - Lint code
- \`npm run format\` - Format code with Prettier
- \`npm run seed\` - Seed database with sample data

## 📝 Next Development Tasks

1. **Authentication System**
   - Create User model
   - Implement JWT authentication
   - Build login/register components

2. **Database Models**
   - User, Module, Badge, Quiz schemas
   - Relationships and indexes

3. **Core Features**
   - Module management
   - Progress tracking
   - Badge system

4. **Frontend Components**
   - Dashboard
   - Module viewer
   - Gamification UI

## 📚 Documentation

- API Documentation: docs/api/
- Deployment Guide: docs/deployment/
- User Guide: docs/user-guide/

## 🤝 Need Help?

- Check the main README.md for detailed information
- Review the code comments
- Consult the documentation in docs/

Happy coding! 🎉
"@
    
    $setupReadme | Set-Content "$rootPath/SETUP.md"
    Write-Success "Created: SETUP.md"
}

# ============================================================================
# Main Execution
# ============================================================================

function Start-Setup {
    try {
        Write-Host @"

╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║        🏨 Housekeeping Onboarding System Setup                ║
║                                                                ║
║        Automated Project Initialization Script                ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

        Test-Prerequisites
        New-ProjectStructure
        New-ConfigurationFiles
        New-CoreFiles
        Install-Dependencies
        New-SetupReadme
        
        Write-Header "Setup Complete! 🎉"
        
        Write-Host @"

✅ Your project has been successfully initialized!

📍 Location: $rootPath

🎯 Next Steps:
   1. Copy .env.example to .env and configure it
   2. Make sure MongoDB is running
   3. Run: npm run dev
   4. Open: http://localhost:3000

📖 Read SETUP.md for detailed next steps

"@ -ForegroundColor Green
        
        Write-Info "Happy coding! 🚀"
        
    } catch {
        Write-Error "Setup failed: $_"
        Write-Host "`nStack Trace:" -ForegroundColor Red
        Write-Host $_.ScriptStackTrace -ForegroundColor Red
        exit 1
    }
}

# Run the setup
Start-Setup
