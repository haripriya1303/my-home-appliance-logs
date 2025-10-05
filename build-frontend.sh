# Render.com Frontend Build Script
# This script builds the frontend for static site deployment

echo "Installing dependencies..."
npm install

echo "Building frontend..."
npm run build

echo "Frontend build completed successfully!"
echo "Static files are in ./dist directory"