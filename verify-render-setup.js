#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 Verifying Render Deployment Setup...\n');

const checks = [];

// Check root package.json
function checkRootPackageJson() {
    try {
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        console.log('✅ Root package.json exists');
        
        // Check scripts
        const requiredScripts = ['dev', 'build', 'start'];
        const hasAllScripts = requiredScripts.every(script => pkg.scripts[script]);
        
        if (hasAllScripts) {
            console.log('✅ All required scripts exist in root package.json');
            console.log(`   - dev: ${pkg.scripts.dev}`);
            console.log(`   - build: ${pkg.scripts.build}`);
            console.log(`   - start: ${pkg.scripts.start}`);
        } else {
            console.log('❌ Missing required scripts in root package.json');
            checks.push('Root package.json scripts');
        }
        
        // Check concurrently dependency
        if (pkg.devDependencies && pkg.devDependencies.concurrently) {
            console.log('✅ Concurrently dependency found');
        } else {
            console.log('❌ Concurrently dependency missing');
            checks.push('Concurrently dependency');
        }
        
    } catch (error) {
        console.log('❌ Root package.json not found or invalid');
        checks.push('Root package.json');
    }
}

// Check backend package.json
function checkBackendPackageJson() {
    try {
        const pkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
        
        console.log('✅ Backend package.json exists');
        
        // Check scripts
        const requiredScripts = ['dev', 'build', 'start'];
        const hasAllScripts = requiredScripts.every(script => pkg.scripts[script]);
        
        if (hasAllScripts) {
            console.log('✅ All required scripts exist in backend package.json');
            console.log(`   - dev: ${pkg.scripts.dev}`);
            console.log(`   - build: ${pkg.scripts.build}`);
            console.log(`   - start: ${pkg.scripts.start}`);
        } else {
            console.log('❌ Missing required scripts in backend package.json');
            checks.push('Backend package.json scripts');
        }
        
        // Check main entry point
        if (pkg.main === 'index.js') {
            console.log('✅ Backend main entry point is index.js');
        } else {
            console.log(`⚠️  Backend main entry point is ${pkg.main} (expected index.js)`);
        }
        
    } catch (error) {
        console.log('❌ Backend package.json not found or invalid');
        checks.push('Backend package.json');
    }
}

// Check backend index.js
function checkBackendIndexJs() {
    if (fs.existsSync('backend/index.js')) {
        console.log('✅ Backend index.js entry point exists');
    } else {
        console.log('❌ Backend index.js entry point missing');
        checks.push('Backend index.js');
    }
}

// Check build directories
function checkBuildDirectories() {
    // Check if builds work (directories exist after build)
    if (fs.existsSync('dist')) {
        console.log('✅ Frontend dist directory exists');
    } else {
        console.log('⚠️  Frontend dist directory not found (run npm run build)');
    }
    
    if (fs.existsSync('backend/dist')) {
        console.log('✅ Backend dist directory exists');
    } else {
        console.log('⚠️  Backend dist directory not found (run cd backend && npm run build)');
    }
}

// Check deployment files
function checkDeploymentFiles() {
    const deploymentFiles = [
        'build.sh',
        'build-frontend.sh',
        'RENDER_DEPLOYMENT.md'
    ];
    
    deploymentFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file} exists`);
        } else {
            console.log(`❌ ${file} missing`);
            checks.push(file);
        }
    });
}

// Check backend environment file
function checkBackendEnv() {
    if (fs.existsSync('backend/.env')) {
        console.log('✅ Backend .env file exists');
    } else {
        console.log('⚠️  Backend .env file not found (create from .env.example)');
    }
}

// Run all checks
console.log('📦 Package.json files:');
checkRootPackageJson();
checkBackendPackageJson();

console.log('\n🚀 Entry points:');
checkBackendIndexJs();

console.log('\n🏗️  Build directories:');
checkBuildDirectories();

console.log('\n📄 Deployment files:');
checkDeploymentFiles();

console.log('\n⚙️  Environment:');
checkBackendEnv();

console.log('\n' + '='.repeat(50));

if (checks.length === 0) {
    console.log('🎉 All checks passed! Your repository is ready for Render deployment.');
    console.log('\n📋 Next steps:');
    console.log('1. Commit and push your changes to GitHub');
    console.log('2. Create services on Render.com:');
    console.log('   - Backend: Web Service with root directory "backend"');
    console.log('   - Frontend: Static Site with root directory "." (root)');
    console.log('3. Configure environment variables in Render');
    console.log('4. Deploy!');
} else {
    console.log('❌ Issues found that need to be addressed:');
    checks.forEach(check => console.log(`   - ${check}`));
    console.log('\nPlease fix these issues before deploying.');
    process.exit(1);
}