#!/usr/bin/env pwsh
# PostgreSQL Date Validation Fix Verification Script
# This script tests the fix for empty string date validation errors

Write-Host "=== PostgreSQL Date Validation Fix Verification ===" -ForegroundColor Green

Write-Host "`n--- Error Background ---" -ForegroundColor Yellow
Write-Host "Error Type: PostgresError (22007) - Invalid input syntax for type date"
Write-Host "Root Cause: Empty strings ('') passed to PostgreSQL date fields"
Write-Host "Solution: Convert empty strings to NULL in validation and service layers"

Write-Host "`n--- Testing API Endpoint ---" -ForegroundColor Yellow
Write-Host "Testing appliance creation with empty nextMaintenanceDate..."

# Test data with empty maintenance date
$testData = @{
    name = "Test Appliance - Date Fix"
    brand = "Samsung"
    model = "TestModel123"
    serialNumber = "DATEFIX001"
    category = "Kitchen"
    location = "Kitchen"
    purchaseDate = "2024-01-15"
    warrantyExpiration = "2026-01-15"
    nextMaintenanceDate = ""
    notes = ""
} | ConvertTo-Json -Depth 3

try {
    # Test the API endpoint
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/appliances" `
        -Method POST `
        -ContentType "application/json" `
        -Body $testData `
        -ErrorAction Stop
    
    Write-Host "✓ SUCCESS: Appliance created successfully!" -ForegroundColor Green
    Write-Host "  Appliance ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "  Name: $($response.data.name)" -ForegroundColor Cyan
    Write-Host "  Maintenance Date: $($response.data.nextMaintenanceDate)" -ForegroundColor Cyan
    
} catch {
    Write-Host "✗ FAILED: Error creating appliance" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $errorDetails = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorDetails)
        $errorBody = $reader.ReadToEnd()
        Write-Host "  Response: $errorBody" -ForegroundColor Red
    }
}

Write-Host "`n--- Fix Summary ---" -ForegroundColor Yellow
Write-Host "✓ Updated validation.ts: Added dateStringOrNull transformer"
Write-Host "✓ Updated applianceService.ts: Clean data before database insertion"
Write-Host "✓ Converted empty strings to null for optional date fields"

Write-Host "`n--- Error Prevention Guide ---" -ForegroundColor Cyan
Write-Host "Future Date Field Handling:"
Write-Host "1. Use Zod transformers to convert empty strings to undefined"
Write-Host "2. Clean data in service layer (empty string → null)"
Write-Host "3. Ensure database schema allows NULL for optional dates"
Write-Host "4. Test with empty values during development"

Write-Host "`n=== Verification Complete ===" -ForegroundColor Green