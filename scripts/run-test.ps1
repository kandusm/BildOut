# Complete test script for the overdue cron job
# This script will:
# 1. Create test data in remote Supabase
# 2. Test the cron endpoint
# 3. Verify the results

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Overdue Cron Job - Complete Test Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create test data in Supabase
Write-Host "Step 1: Creating test overdue invoice in Supabase..." -ForegroundColor Yellow
npx supabase db execute --file scripts/setup-test-overdue.sql
Write-Host ""

# Wait a moment for data to be committed
Start-Sleep -Seconds 2

# Step 2: Check if dev server is running
Write-Host "Step 2: Checking if dev server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -Method GET -TimeoutSec 2 -ErrorAction Stop
    Write-Host "Dev server is running on port 3001" -ForegroundColor Green
} catch {
    Write-Host "WARNING: Dev server may not be running on port 3001" -ForegroundColor Red
    Write-Host "Please run 'npm run dev' in another terminal first" -ForegroundColor Red
    Write-Host ""
    exit 1
}
Write-Host ""

# Step 3: Test the cron endpoint WITH authorization
Write-Host "Step 3: Testing cron endpoint WITH authorization..." -ForegroundColor Yellow
Write-Host "Command: curl -X GET http://localhost:3001/api/cron/overdue -H 'Authorization: Bearer dev_secret_change_in_production'" -ForegroundColor Gray
$response = curl.exe -X GET "http://localhost:3001/api/cron/overdue" `
  -H "Authorization: Bearer dev_secret_change_in_production" `
  -H "Content-Type: application/json" `
  2>&1

Write-Host "Response:" -ForegroundColor Green
Write-Host $response -ForegroundColor White
Write-Host ""

# Step 4: Test WITHOUT authorization (should fail)
Write-Host "Step 4: Testing cron endpoint WITHOUT authorization (should return 401)..." -ForegroundColor Yellow
$response = curl.exe -X GET "http://localhost:3001/api/cron/overdue" 2>&1
Write-Host "Response:" -ForegroundColor Green
Write-Host $response -ForegroundColor White
Write-Host ""

# Step 5: Verify results in database
Write-Host "Step 5: Verifying invoice status was updated to 'overdue'..." -ForegroundColor Yellow
npx supabase db execute --sql "SELECT number, status, due_date, amount_due FROM invoices WHERE number = 999999;"
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Notes:" -ForegroundColor Yellow
Write-Host "- If RESEND_API_KEY is not set, emails won't be sent (but invoice status will still update)" -ForegroundColor Gray
Write-Host "- Check the response above to see how many invoices were processed" -ForegroundColor Gray
Write-Host "- Invoice #999999 should now have status 'overdue'" -ForegroundColor Gray
