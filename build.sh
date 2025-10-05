# Render.com Build Script
# This script ensures proper setup for Render deployment

echo "Installing root dependencies..."
npm install

echo "Installing backend dependencies..."
cd backend
npm install

echo "Building backend..."
npm run build

echo "Build completed successfully!"