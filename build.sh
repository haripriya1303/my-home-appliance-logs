# Render.com Build Script
# This script ensures proper setup for Render deployment

echo "Installing dependencies..."
npm install

echo "Building backend via Turborepo pipeline..."
npx turbo run build --filter=home-appliance-backend

echo "Build completed successfully!"