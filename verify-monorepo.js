#!/usr/bin/env node

/**
 * Monorepo Verification Script
 * 
 * This script verifies that the monorepo structure is correctly implemented
 * and all packages can be built successfully.
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

console.log('🔍 Verifying Monorepo Implementation...\n');

// Check if we're in the right directory
if (!existsSync(join(process.cwd(), 'package.json'))) {
  console.error('❌ Error: package.json not found in current directory');
  process.exit(1);
}

// Read root package.json
const rootPackageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));

// Check workspaces configuration
if (!rootPackageJson.workspaces || !Array.isArray(rootPackageJson.workspaces)) {
  console.error('❌ Error: Workspaces not configured in root package.json');
  process.exit(1);
}

console.log('✅ Root package.json has workspaces configuration');

// Check if packages directory exists
if (!existsSync(join(process.cwd(), 'packages'))) {
  console.error('❌ Error: packages directory not found');
  process.exit(1);
}

console.log('✅ packages directory exists');

// Check frontend package
const frontendPath = join(process.cwd(), 'packages', 'frontend');
if (!existsSync(frontendPath)) {
  console.error('❌ Error: frontend package not found');
  process.exit(1);
}

if (!existsSync(join(frontendPath, 'package.json'))) {
  console.error('❌ Error: frontend package.json not found');
  process.exit(1);
}

const frontendPackageJson = JSON.parse(readFileSync(join(frontendPath, 'package.json'), 'utf-8'));
if (frontendPackageJson.name !== 'home-appliance-frontend') {
  console.error('❌ Error: frontend package has incorrect name');
  process.exit(1);
}

console.log('✅ Frontend package verified');

// Check backend package
const backendPath = join(process.cwd(), 'packages', 'backend');
if (!existsSync(backendPath)) {
  console.error('❌ Error: backend package not found');
  process.exit(1);
}

if (!existsSync(join(backendPath, 'package.json'))) {
  console.error('❌ Error: backend package.json not found');
  process.exit(1);
}

const backendPackageJson = JSON.parse(readFileSync(join(backendPath, 'package.json'), 'utf-8'));
if (backendPackageJson.name !== 'home-appliance-backend') {
  console.error('❌ Error: backend package has incorrect name');
  process.exit(1);
}

console.log('✅ Backend package verified');

// Test building frontend
try {
  console.log('\n🏗️  Building frontend...');
  execSync('npm run build --workspace=home-appliance-frontend', { stdio: 'inherit' });
  console.log('✅ Frontend build successful');
} catch (error) {
  console.error('❌ Error: Frontend build failed');
  process.exit(1);
}

// Test building backend
try {
  console.log('\n🏗️  Building backend...');
  execSync('npm run build --workspace=home-appliance-backend', { stdio: 'inherit' });
  console.log('✅ Backend build successful');
} catch (error) {
  console.error('❌ Error: Backend build failed');
  process.exit(1);
}

// Test building all packages
try {
  console.log('\n🏗️  Building all packages...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ All packages build successful');
} catch (error) {
  console.error('❌ Error: Building all packages failed');
  process.exit(1);
}

console.log('\n🎉 Monorepo verification completed successfully!');
console.log('\n📋 Summary:');
console.log('  - Workspaces configured correctly');
console.log('  - Frontend package verified');
console.log('  - Backend package verified');
console.log('  - All packages build successfully');
console.log('\n🚀 Your monorepo is ready for development!');