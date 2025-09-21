# Railway Deployment Guide

## Problem Fixed
- **Error**: `bun install --frozen-lockfile` conflicts
- **Root Cause**: Railway auto-detected project as Bun instead of NPM
- **Solution**: Added explicit NPM configuration files

## Configuration Files Added

### 1. railway.toml
- Configures Railway for monorepo deployment
- Defines separate frontend and backend services
- Specifies build commands and patterns

### 2. nixpacks.toml (Root)
- Forces Nixpacks to use Node.js 18 and NPM
- Defines build and deployment phases for frontend
- Sets production environment variables

### 3. backend/nixpacks.toml
- Backend-specific Nixpacks configuration
- Configures TypeScript compilation and startup
- Sets proper Node.js and NPM versions

## Deployment Instructions

### Option 1: Deploy Both Services (Recommended)

#### Frontend Deployment:
1. Create new Railway service
2. Connect to your Git repository
3. **Root Directory**: `/` (project root)
4. **Build Command**: `npm install && npm run build`
5. **Start Command**: `npm run preview`
6. **Environment Variables**: None required

#### Backend Deployment:
1. Create new Railway service  
2. Connect to your Git repository
3. **Root Directory**: `/backend`
4. **Build Command**: `npm install && npm run build`
5. **Start Command**: `npm start`
6. **Environment Variables**:
   ```
   DATABASE_URL=your_postgresql_connection_string
   NODE_ENV=production
   PORT=3001
   CORS_ORIGIN=your_frontend_railway_url
   ```

### Option 2: Deploy Backend Only

If you only need to deploy the backend:
1. Create Railway service
2. Connect to Git repository
3. Set root directory to `/backend`
4. Railway will automatically use the backend/nixpacks.toml configuration

## Environment Variables Setup

### Backend Required Variables:
- `DATABASE_URL`: PostgreSQL connection string (use Railway's PostgreSQL service)
- `NODE_ENV`: Set to `production`
- `CORS_ORIGIN`: Your frontend URL (if deploying frontend separately)

### Frontend Variables (if needed):
- `VITE_API_URL`: Your backend Railway URL

## Post-Deployment Steps

1. **Database Setup**: Run migrations if using Railway PostgreSQL
2. **CORS Configuration**: Update backend CORS_ORIGIN with frontend URL
3. **Frontend API URL**: Update frontend to point to backend Railway URL

## Troubleshooting

### Common Issues:
1. **Build Failures**: Ensure package.json scripts work locally first
2. **Port Conflicts**: Railway automatically provides PORT environment variable
3. **CORS Errors**: Set CORS_ORIGIN to exact frontend URL (including https://)
4. **Database Connection**: Use Railway's PostgreSQL service or external database

### Error Prevention:
- ✅ Use NPM (not Bun) via nixpacks.toml
- ✅ Proper build scripts in package.json
- ✅ Environment variable configuration
- ✅ CORS setup for frontend-backend communication

## Testing Locally Before Deployment

Run these commands to verify everything works:

```bash
# Test frontend build
npm install
npm run build
npm run preview

# Test backend build
cd backend
npm install
npm run build
npm start
```

## Files Modified/Added:
- ✅ railway.toml (deployment configuration)
- ✅ nixpacks.toml (NPM build configuration)
- ✅ backend/nixpacks.toml (backend-specific config)
- ✅ backend/package.json (added postbuild script)
- ✅ prepare-railway-deployment.ps1 (verification script)

Your project is now ready for Railway deployment! The Bun lockfile error will be resolved by the explicit NPM configuration.