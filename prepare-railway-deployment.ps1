#!/usr/bin/env pwsh
# Railway Deployment Preparation Script
# This script prepares the project for Railway deployment

Write-Host "=== Railway Deployment Preparation ===" -ForegroundColor Green

Write-Host "`n--- Issue Analysis ---" -ForegroundColor Yellow
Write-Host "Error: Bun lockfile conflicts during Railway deployment"
Write-Host "Root Cause: Railway auto-detected project as Bun instead of NPM"
Write-Host "Solution: Explicit NPM configuration with Railway/Nixpacks files"

Write-Host "`n--- Checking Project Structure ---" -ForegroundColor Yellow

# Check if we're in the right directory
if (Test-Path "package.json" -and Test-Path "packages/frontend/package.json" -and Test-Path "packages/backend/package.json") {
    Write-Host "✓ Monorepo structure detected" -ForegroundColor Green
    Write-Host "  Frontend: packages/frontend/package.json" -ForegroundColor Cyan
    Write-Host "  Backend: packages/backend/package.json" -ForegroundColor Cyan
} else {
    Write-Host "✗ Invalid project structure" -ForegroundColor Red
    exit 1
}

Write-Host "`n--- Verifying Configuration Files ---" -ForegroundColor Yellow

# Check Railway configuration files
$configFiles = @("railway.toml", "nixpacks.toml", "packages/backend/nixpacks.toml")
foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "✗ $file missing" -ForegroundColor Red
    }
}

Write-Host "`n--- Testing Build Process ---" -ForegroundColor Yellow

# Test frontend build
Write-Host "Testing frontend build..."
try {
    npm install --silent
    npx turbo run build --filter=home-appliance-frontend
    Write-Host "✓ Frontend build successful" -ForegroundColor Green
} catch {
    Write-Host "✗ Frontend build failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test backend build
Write-Host "Testing backend build..."
try {
    npx turbo run build --filter=home-appliance-backend
    Write-Host "✓ Backend build successful" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend build failed: $($_.Exception.Message)" -ForegroundColor Red
    Set-Location ..
}

Write-Host "`n--- Railway Deployment Instructions ---" -ForegroundColor Cyan
Write-Host "1. Commit all configuration files to Git:"
Write-Host "   git add railway.toml nixpacks.toml packages/backend/nixpacks.toml"
Write-Host "   git commit -m 'Add Railway deployment configuration'"
Write-Host ""
Write-Host "2. For Frontend deployment:"
Write-Host "   - Create new Railway service"
Write-Host "   - Connect to Git repository"
Write-Host "   - Set root directory to: /"
Write-Host "   - Build command: npm install && npx turbo run build --filter=home-appliance-frontend"
Write-Host "   - Start command: npm run preview --workspace=home-appliance-frontend -- --host 0.0.0.0 --port $PORT"
Write-Host ""
Write-Host "3. For Backend deployment:"
Write-Host "   - Create new Railway service"
Write-Host "   - Connect to Git repository"
Write-Host "   - Set root directory to: /"
Write-Host "   - Build command: npm install && npx turbo run build --filter=home-appliance-backend"
Write-Host "   - Start command: npm run start --workspace=home-appliance-backend"
Write-Host ""
Write-Host "4. Environment Variables (Backend):"
Write-Host "   - DATABASE_URL=your_postgresql_connection_string"
Write-Host "   - NODE_ENV=production"
Write-Host "   - PORT=3001"
Write-Host "   - CORS_ORIGIN=your_frontend_url"

Write-Host "`n--- Deployment Error Prevention ---" -ForegroundColor Yellow
Write-Host "Common Issues & Solutions:"
Write-Host "• Bun lockfile error → Use nixpacks.toml to force NPM"
Write-Host "• Build failures → Verify package.json scripts work locally"
Write-Host "• Port conflicts → Use Railway's PORT environment variable"
Write-Host "• CORS errors → Set CORS_ORIGIN to frontend Railway URL"

Write-Host "`n=== Preparation Complete ===" -ForegroundColor Green
Write-Host "Your project is now ready for Railway deployment!"