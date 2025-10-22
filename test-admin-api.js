#!/usr/bin/env node
/**
 * Admin API Testing Script
 *
 * Tests all admin endpoints to verify Week 4 Day 17 completion
 *
 * Usage:
 *   1. Start dev server: npm run dev
 *   2. Run this script: node test-admin-api.js
 */

const BASE_URL = 'http://localhost:3000';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60) + '\n');
}

async function testEndpoint(name, method, endpoint, body = null, expectedStatus = 200) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    log(`Testing: ${method} ${endpoint}`, 'blue');

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json().catch(() => ({}));

    const success = response.status === expectedStatus;

    if (success) {
      log(`✅ PASS - Status: ${response.status}`, 'green');
    } else {
      log(`❌ FAIL - Expected: ${expectedStatus}, Got: ${response.status}`, 'red');
    }

    console.log('Response:', JSON.stringify(data, null, 2));

    return { success, data, status: response.status };
  } catch (error) {
    log(`❌ ERROR: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  logSection('ADMIN API TESTING SUITE');

  log('Starting tests...', 'yellow');
  log(`Base URL: ${BASE_URL}\n`, 'yellow');

  const results = {
    passed: 0,
    failed: 0,
    tests: [],
  };

  // Test 1: Debug endpoint (check admin status)
  logSection('Test 1: Check Admin Status');
  const debugResult = await testEndpoint(
    'Admin Debug',
    'GET',
    '/api/admin/debug'
  );
  results.tests.push({ name: 'Debug Endpoint', ...debugResult });
  debugResult.success ? results.passed++ : results.failed++;

  if (!debugResult.data?.isAdmin) {
    log('\n⚠️  WARNING: Current user is not an admin!', 'yellow');
    log('To grant admin access, run this SQL in Supabase:', 'yellow');
    log('\nUPDATE public.users SET is_admin = true WHERE id = (SELECT id FROM auth.users WHERE email = \'your-email@example.com\');\n', 'cyan');
    log('Remaining tests may fail due to lack of admin privileges.\n', 'yellow');
  }

  // Test 2: List merchants
  logSection('Test 2: List All Merchants');
  const merchantsResult = await testEndpoint(
    'List Merchants',
    'GET',
    '/api/admin/merchants'
  );
  results.tests.push({ name: 'List Merchants', ...merchantsResult });
  merchantsResult.success ? results.passed++ : results.failed++;

  // Store first merchant ID for detail tests
  let testMerchantId = null;
  if (merchantsResult.data?.merchants?.length > 0) {
    testMerchantId = merchantsResult.data.merchants[0].id;
    log(`\nFound ${merchantsResult.data.merchants.length} merchant(s)`, 'cyan');
    log(`Using merchant ID: ${testMerchantId} for remaining tests\n`, 'cyan');
  } else {
    log('\n⚠️  WARNING: No merchants found. Some tests will be skipped.\n', 'yellow');
  }

  // Test 3: Get merchant details
  if (testMerchantId) {
    logSection('Test 3: Get Merchant Details');
    const detailResult = await testEndpoint(
      'Merchant Details',
      'GET',
      `/api/admin/merchants/${testMerchantId}`
    );
    results.tests.push({ name: 'Merchant Details', ...detailResult });
    detailResult.success ? results.passed++ : results.failed++;
  }

  // Test 4: Generate Stripe login link (only if merchant has Stripe Connect)
  if (testMerchantId) {
    logSection('Test 4: Generate Stripe Login Link');
    log('Note: This will fail if merchant has no Stripe Connect account\n', 'yellow');
    const loginLinkResult = await testEndpoint(
      'Stripe Login Link',
      'POST',
      `/api/admin/merchants/${testMerchantId}/login-link`
    );

    // Accept both 200 (success) and 400 (no Stripe account) as valid
    if (loginLinkResult.status === 200) {
      log('✅ Login link generated successfully', 'green');
      results.passed++;
    } else if (loginLinkResult.status === 400 && loginLinkResult.data?.error?.includes('no Stripe Connect')) {
      log('✅ Correctly handled merchant without Stripe account', 'green');
      results.passed++;
    } else {
      log('❌ Unexpected response', 'red');
      results.failed++;
    }
    results.tests.push({ name: 'Stripe Login Link', ...loginLinkResult });
  }

  // Test 5: Suspend merchant
  if (testMerchantId) {
    logSection('Test 5: Suspend Merchant');
    const suspendResult = await testEndpoint(
      'Suspend Merchant',
      'POST',
      `/api/admin/merchants/${testMerchantId}/suspend`,
      { reason: 'Test suspension' }
    );
    results.tests.push({ name: 'Suspend Merchant', ...suspendResult });
    suspendResult.success ? results.passed++ : results.failed++;
  }

  // Test 6: Resume merchant
  if (testMerchantId) {
    logSection('Test 6: Resume Merchant');
    const resumeResult = await testEndpoint(
      'Resume Merchant',
      'POST',
      `/api/admin/merchants/${testMerchantId}/resume`
    );
    results.tests.push({ name: 'Resume Merchant', ...resumeResult });
    resumeResult.success ? results.passed++ : results.failed++;
  }

  // Test 7: Test pagination
  logSection('Test 7: Test Pagination');
  const paginationResult = await testEndpoint(
    'Merchants with Pagination',
    'GET',
    '/api/admin/merchants?limit=2&offset=0'
  );
  results.tests.push({ name: 'Pagination', ...paginationResult });
  paginationResult.success ? results.passed++ : results.failed++;

  // Test 8: Test search
  logSection('Test 8: Test Search');
  const searchResult = await testEndpoint(
    'Search Merchants',
    'GET',
    '/api/admin/merchants?search=test'
  );
  results.tests.push({ name: 'Search', ...searchResult });
  searchResult.success ? results.passed++ : results.failed++;

  // Test 9: Error handling - non-existent merchant
  logSection('Test 9: Error Handling - Non-existent Merchant');
  const notFoundResult = await testEndpoint(
    'Non-existent Merchant',
    'GET',
    '/api/admin/merchants/00000000-0000-0000-0000-000000000000',
    null,
    404
  );
  results.tests.push({ name: 'Error Handling', ...notFoundResult });
  notFoundResult.success ? results.passed++ : results.failed++;

  // Summary
  logSection('TEST RESULTS SUMMARY');

  log(`Total Tests: ${results.tests.length}`, 'cyan');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((results.passed / results.tests.length) * 100).toFixed(1)}%`,
      results.failed === 0 ? 'green' : 'yellow');

  console.log('\n' + '='.repeat(60) + '\n');

  if (results.failed === 0) {
    log('🎉 ALL TESTS PASSED! Week 4 Day 17 is complete!', 'green');
    log('\nNext Steps:', 'cyan');
    log('1. Review ADMIN_TESTING_GUIDE.md for manual testing', 'cyan');
    log('2. Verify audit logs in Supabase dashboard', 'cyan');
    log('3. Begin Week 5: Admin Dashboard UI', 'cyan');
  } else {
    log('⚠️  Some tests failed. Please review the output above.', 'yellow');
    log('\nCommon issues:', 'yellow');
    log('- Dev server not running: npm run dev', 'yellow');
    log('- Not logged in: Sign in to the application', 'yellow');
    log('- No admin access: Grant admin via SQL (see above)', 'yellow');
  }

  console.log('\n');
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test suite failed: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
