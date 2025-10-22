# Testing the Overdue Cron Job

## Prerequisites

1. **Resend API Key** (Optional for initial testing)
   - The cron job will still work without it, but emails won't be sent
   - To get one: Sign up at https://resend.com and get an API key
   - Add it to `.env.local`: `RESEND_API_KEY=re_your_key_here`

2. **Test Data** (Required)
   - You need at least one overdue invoice in your database
   - Use `scripts/create-test-overdue-invoice.sql` to create test data

## Local Testing (with dev server running)

1. Start your development server:
   ```bash
   npm run dev
   ```

2. In another terminal, test the cron endpoint with authorization:
   ```bash
   curl -X GET "http://localhost:3000/api/cron/overdue" \
     -H "Authorization: Bearer dev_secret_change_in_production" \
     -H "Content-Type: application/json"
   ```

3. Test without authorization (should return 401):
   ```bash
   curl -X GET "http://localhost:3000/api/cron/overdue"
   ```

## What the Cron Job Does

The cron job will:
1. Query for invoices with status 'sent', 'viewed', or 'partial' that have a due_date before today
2. Update each invoice status to 'overdue'
3. Send reminder emails to clients who have an email address
4. Return a summary of:
   - Total overdue invoices found
   - Number of invoices updated
   - Number of emails sent
   - Any errors encountered

## Expected Response

Success response:
```json
{
  "message": "Overdue detection completed",
  "totalFound": 5,
  "updated": 5,
  "emailsSent": 4,
  "errors": []
}
```

No overdue invoices:
```json
{
  "message": "No overdue invoices found",
  "count": 0
}
```

## Production Testing

Once deployed to Vercel:

1. The cron job will run automatically at 9:00 AM UTC every day
2. You can manually trigger it via Vercel dashboard or API
3. Check Vercel logs to see execution results

## Monitoring

- Check Vercel Cron logs in the dashboard
- Monitor email delivery in Resend dashboard
- Check invoice status updates in Supabase database

## Troubleshooting

### "No overdue invoices found"
- Run the SQL from `scripts/create-test-overdue-invoice.sql` to create test data
- Verify the invoice status is 'sent', 'viewed', or 'partial'
- Verify the due_date is before today

### Email errors
- Check that RESEND_API_KEY is set in `.env.local`
- Verify the client has an email address
- Check Resend dashboard for delivery status

### Port issues
- Make sure your dev server is running on port 3000
- Check NEXT_PUBLIC_APP_URL in `.env.local` matches your dev server port
