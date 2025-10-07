# Render.com Frontend Build Script
# This script builds the frontend for static site deployment

echo "Installing dependencies..."
npm install

echo "Building frontend via Turborepo pipeline..."
npx turbo run build --filter=home-appliance-frontend

echo "Frontend build completed successfully!"
echo "Static files are in ./packages/frontend/dist directory"