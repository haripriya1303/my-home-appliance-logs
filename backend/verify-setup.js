#!/usr/bin/env node

/**
 * Backend Setup Verification Script
 * Run with: node verify-setup.js
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Verifying Backend Setup...\n');

// Check required files
const requiredFiles = [
  'package.json',
  '.env',
  'tsconfig.json',
  'drizzle.config.ts',
  'src/app.ts',
  'src/config/database.ts',
  'src/config/environment.ts',
  'src/database/schema/appliances.ts',
  'src/services/applianceService.ts',
  'src/controllers/applianceController.ts',
  'src/routes/appliances.ts',
  'src/middleware/validation.ts',
  'src/middleware/errorHandler.ts'
];

let allFilesExist = true;

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  const filePath = join(__dirname, file);
  const exists = existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Check package.json dependencies
console.log('\n📦 Checking dependencies:');
try {
  const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));
  
  const requiredDeps = [
    'express',
    'cors',
    'helmet',
    'morgan',
    'dotenv',
    'drizzle-orm',
    'postgres',
    'zod',
    'compression'
  ];
  
  const requiredDevDeps = [
    '@types/express',
    '@types/cors',
    '@types/morgan',
    '@types/compression',
    '@types/pg',
    'drizzle-kit',
    'typescript',
    'ts-node',
    'nodemon'
  ];
  
  requiredDeps.forEach(dep => {
    const exists = packageJson.dependencies && packageJson.dependencies[dep];
    console.log(`  ${exists ? '✅' : '❌'} ${dep} ${exists ? `(${packageJson.dependencies[dep]})` : ''}`);
  });
  
  requiredDevDeps.forEach(dep => {
    const exists = packageJson.devDependencies && packageJson.devDependencies[dep];
    console.log(`  ${exists ? '✅' : '❌'} ${dep} (dev) ${exists ? `(${packageJson.devDependencies[dep]})` : ''}`);
  });
  
} catch (error) {
  console.log('  ❌ Error reading package.json');
  allFilesExist = false;
}

// Check .env file
console.log('\n🔧 Checking environment configuration:');
try {
  const envContent = readFileSync(join(__dirname, '.env'), 'utf8');
  const envVars = ['DATABASE_URL', 'NODE_ENV', 'PORT', 'CORS_ORIGIN'];
  
  envVars.forEach(variable => {
    const exists = envContent.includes(`${variable}=`);
    console.log(`  ${exists ? '✅' : '❌'} ${variable}`);
  });
} catch (error) {
  console.log('  ❌ Error reading .env file');
  allFilesExist = false;
}

// Check TypeScript compilation
console.log('\n🔨 Checking TypeScript compilation:');
try {
  const distExists = existsSync(join(__dirname, 'dist'));
  console.log(`  ${distExists ? '✅' : '❌'} dist/ directory exists`);
  
  if (distExists) {
    const appJsExists = existsSync(join(__dirname, 'dist', 'app.js'));
    console.log(`  ${appJsExists ? '✅' : '❌'} dist/app.js exists`);
  }
} catch (error) {
  console.log('  ❌ Error checking compilation output');
}

console.log('\n📝 Next Steps:');

if (!allFilesExist) {
  console.log('❌ Setup verification failed. Please ensure all required files exist.');
  process.exit(1);
}

console.log('✅ Backend setup verification complete!');
console.log('\n🚀 To start the backend:');
console.log('1. Make sure PostgreSQL is running');
console.log('2. Create the database: createdb appliance_tracker');
console.log('3. Run migrations: npm run db:migrate');
console.log('4. (Optional) Seed data: npm run db:seed');
console.log('5. Start development server: npm run dev');
console.log('\n🌐 The server will be available at: http://localhost:3001');
console.log('📊 Health check endpoint: http://localhost:3001/health');
console.log('📋 API documentation: See README.md');

process.exit(0);