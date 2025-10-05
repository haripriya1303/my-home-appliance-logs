# Render Deployment Guide

## Overview

This monorepo contains both frontend (React/Vite) and backend (Express.js/TypeScript) applications, configured for deployment on Render.com.

## Deployment Options

### Option 1: Separate Services (Recommended)

Deploy frontend and backend as separate Render services for better scalability and resource management.

#### Backend Deployment (Web Service)

1. **Create a new Web Service on Render**
2. **Repository Settings:**
   - Connect your GitHub repository
   - **Root Directory:** `backend`
   
3. **Build & Deploy Settings:**
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   
4. **Environment Variables:**
   Add all required environment variables from your `backend/.env` file:
   - `DATABASE_URL`
   - `NODE_ENV=production`
   - `PORT` (Render will set this automatically)
   - `CORS_ORIGIN` (set to your frontend URL)

#### Frontend Deployment (Static Site)

1. **Create a new Static Site on Render**
2. **Repository Settings:**
   - Connect your GitHub repository
   - **Root Directory:** (leave empty - use root)
   
3. **Build & Deploy Settings:**
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

### Option 2: Single Service Deployment

Deploy both frontend and backend as a single web service.

1. **Create a new Web Service on Render**
2. **Build & Deploy Settings:**
   - **Build Command:** `npm install && cd backend && npm install && npm run build && cd .. && npm run build`
   - **Start Command:** `npm start`

## Project Structure

```
.
├── src/                     # React frontend
├── backend/                 # Express.js backend
│   ├── src/                # TypeScript source
│   ├── dist/               # Compiled JavaScript (after build)
│   └── index.js            # Entry point for deployment
├── dist/                   # Frontend build output
├── build.sh               # Backend build script
└── build-frontend.sh      # Frontend build script
```

## Scripts Configuration

### Root package.json
- `npm run dev` - Start both frontend and backend concurrently
- `npm run build` - Build frontend for production
- `npm start` - Start backend in production mode

### Backend package.json
- `npm run dev` - Development mode with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server (uses index.js)

## Environment Configuration

### Backend Environment Variables

Create these environment variables in your Render backend service:

```env
NODE_ENV=production
DATABASE_URL=your_postgresql_connection_string
CORS_ORIGIN=https://your-frontend-url.onrender.com
```

### CORS Configuration

Make sure your backend's CORS_ORIGIN environment variable matches your frontend URL exactly:
- For development: `http://localhost:5173`
- For production: `https://your-frontend-url.onrender.com`

## Build Process

### Backend Build
1. Installs dependencies (`npm install`)
2. Compiles TypeScript to JavaScript (`npm run build`)
3. Generates database migrations
4. Creates `dist/` folder with compiled code

### Frontend Build
1. Installs dependencies (`npm install`)
2. Builds React app (`npm run build`)
3. Creates `dist/` folder with static files

## Health Checks

The backend includes a health check endpoint at `/health` that you can use for Render's health monitoring.

## Database

The backend is configured to work with PostgreSQL (via Supabase). Make sure to:
1. Set up your database on Supabase or another PostgreSQL provider
2. Configure the `DATABASE_URL` environment variable
3. Run migrations after deployment

## Troubleshooting

### Common Issues

1. **CORS Errors:** Ensure `CORS_ORIGIN` environment variable is set correctly
2. **Database Connection:** Verify `DATABASE_URL` is properly configured
3. **Build Failures:** Check that all dependencies are properly installed
4. **Port Issues:** Render automatically sets the PORT environment variable

### Logs

Check Render logs for detailed error information:
- Navigate to your service dashboard
- Click on "Logs" to see real-time application logs

## Local Testing

Test your deployment configuration locally:

```bash
# Install all dependencies
npm install
cd backend && npm install && cd ..

# Build everything
npm run build
cd backend && npm run build && cd ..

# Test backend
cd backend && npm start

# Test frontend build
# Serve the dist/ folder with any static file server
```