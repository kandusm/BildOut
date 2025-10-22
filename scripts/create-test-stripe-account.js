/**
 * Quick script to create a test Stripe Connect account
 * Run with: node scripts/create-test-stripe-account.js
 */

const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createTestAccount() {
  try {
    console.log('Creating Stripe Express account...');

    const account = await stripe.accounts.create({
      type: 'express',
      email: 'test-merchant@example.com',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      individual: {
        first_name: 'Test',
        last_name: 'Merchant',
        email: 'test-merchant@example.com',
      },
      metadata: {
        test_account: 'true',
      },
    });

    console.log('\n✅ Stripe Connect Account Created!');
    console.log('Account ID:', account.id);
    console.log('\nNow update your database:');
    console.log(`UPDATE users SET stripe_connect_id = '${account.id}', onboarding_status = 'pending' WHERE id = '<your-user-id>';`);

    // Create an account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?stripe_refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?stripe_onboarding=complete`,
      type: 'account_onboarding',
    });

    console.log('\nOnboarding URL (complete setup):');
    console.log(accountLink.url);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

createTestAccount();
