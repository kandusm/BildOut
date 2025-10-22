# PowerShell script to test the overdue cron job
# This makes it easier to test on Windows

Write-Host "Testing Overdue Cron Job" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Test 1: With authorization (should work)
Write-Host "Test 1: Testing with authorization..." -ForegroundColor Yellow
$response = curl.exe -X GET "http://localhost:3000/api/cron/overdue" `
  -H "Authorization: Bearer dev_secret_change_in_production" `
  -H "Content-Type: application/json" `
  2>&1

Write-Host $response -ForegroundColor Green
Write-Host ""

# Test 2: Without authorization (should return 401)
Write-Host "Test 2: Testing without authorization (should fail)..." -ForegroundColor Yellow
$response = curl.exe -X GET "http://localhost:3000/api/cron/overdue" 2>&1
Write-Host $response -ForegroundColor Green
Write-Host ""

Write-Host "Tests completed!" -ForegroundColor Cyan
