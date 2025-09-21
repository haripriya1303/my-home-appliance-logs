#!/usr/bin/env pwsh
# Test script for new status-based filtering API endpoint

Write-Host "=== Testing Status-Based Filtering API ===" -ForegroundColor Green

# Base URL for the API
$baseUrl = "http://localhost:3001/api/appliances"

Write-Host "`n--- Testing New Status Parameter ---" -ForegroundColor Yellow

# Test 1: Get active appliances (warranty_expiration >= today)
Write-Host "1. Testing status=active (warranties still valid)..."
try {
    $response = Invoke-RestMethod -Uri "$baseUrl?status=active" -Method GET
    Write-Host "   ✓ Active appliances: $($response.data.Count)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get expiring soon appliances
Write-Host "2. Testing status=expiring-soon (expiring in 30 days)..."
try {
    $response = Invoke-RestMethod -Uri "$baseUrl?status=expiring-soon" -Method GET
    Write-Host "   ✓ Expiring soon appliances: $($response.data.Count)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get expired appliances
Write-Host "3. Testing status=expired (warranties expired)..."
try {
    $response = Invoke-RestMethod -Uri "$baseUrl?status=expired" -Method GET
    Write-Host "   ✓ Expired appliances: $($response.data.Count)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n--- Testing Count Functionality ---" -ForegroundColor Yellow

# Test 4: Get appliances with counts
Write-Host "4. Testing includeCounts=true (summary counts)..."
try {
    $response = Invoke-RestMethod -Uri "$baseUrl?includeCounts=true" -Method GET
    if ($response.counts) {
        Write-Host "   ✓ Counts available:" -ForegroundColor Green
        Write-Host "     Active: $($response.counts.active)" -ForegroundColor Cyan
        Write-Host "     Expiring Soon: $($response.counts.expiringSoon)" -ForegroundColor Cyan
        Write-Host "     Expired: $($response.counts.expired)" -ForegroundColor Cyan
    } else {
        Write-Host "   ✗ Counts not returned" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n--- Testing Combined Filters ---" -ForegroundColor Yellow

# Test 5: Combine status with search
Write-Host "5. Testing status=active with search..."
try {
    $response = Invoke-RestMethod -Uri "$baseUrl?status=active&search=Samsung" -Method GET
    Write-Host "   ✓ Active Samsung appliances: $($response.data.Count)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Test with limit
Write-Host "6. Testing status=active with limit=5..."
try {
    $response = Invoke-RestMethod -Uri "$baseUrl?status=active&limit=5" -Method GET
    Write-Host "   ✓ Limited active appliances: $($response.data.Count)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n--- API Endpoint Documentation ---" -ForegroundColor Cyan
Write-Host "New Parameters Added:"
Write-Host "• status: 'active' | 'expiring-soon' | 'expired'"
Write-Host "• includeCounts: boolean (returns count summary)"
Write-Host ""
Write-Host "Status Filter Logic:"
Write-Host "• active: warranty_expiration >= today"
Write-Host "• expiring-soon: warranty_expiration between today and 30 days"
Write-Host "• expired: warranty_expiration < today"
Write-Host ""
Write-Host "Response Format (with counts):"
Write-Host "{"
Write-Host "  success: true,"
Write-Host "  data: [appliances],"
Write-Host "  counts: { active: number, expiringSoon: number, expired: number },"
Write-Host "  count: number"
Write-Host "}"

Write-Host "`n=== Test Complete ===" -ForegroundColor Green