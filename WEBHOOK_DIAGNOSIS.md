# 🔍 Stripe Webhook Diagnosis & Fix

## Current Status

### ✅ Working

- Backend webhook endpoint is accessible at `/api/v1/payments/stripe/webhook`
- Raw body parsing middleware is now configured
- Environment variables are properly set
- Using TEST mode keys (correct for development)

### ❌ Issue Found

**Your webhook secret doesn't match your Stripe configuration!**

You have:

- **Local .env**: `STRIPE_WEBHOOK_SECRET=whsec_ra3W3sjBjhr86FI5D4TlVLQrL3TIDRmv`
- **Stripe Dashboard**: Webhook pointing to production URL: `https://dbroyal-backend-db-royal-studios1114-g4qym111.leapcell.dev`

This mismatch means:

1. ✅ Payments are created successfully
2. ❌ Webhooks fail verification
3. ❌ Payment confirmations don't complete
4. ❌ Transactions don't appear as completed in your database

---

## 🔧 Solution: Fix Local Webhook Configuration

### Option 1: Stripe CLI (Recommended for Development)

The Stripe CLI creates a local webhook forwarder that works perfectly for development.

#### Steps:

1. **Install Stripe CLI** (if not already installed):

   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Login to Stripe**:

   ```bash
   stripe login
   ```

3. **Start webhook forwarding** (in a separate terminal):

   ```bash
   stripe listen --forward-to localhost:8081/api/v1/payments/stripe/webhook
   ```

4. **Copy the webhook signing secret** displayed in the terminal (starts with `whsec_`)

5. **Update your .env file**:

   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
   ```

6. **Restart your backend server**

7. **Test it**:
   ```bash
   # In another terminal
   stripe trigger payment_intent.succeeded
   ```

#### Quick Setup Script:

```bash
./setup-local-webhooks.sh
```

---

### Option 2: Update Production Webhook (Not Recommended for Local Testing)

If you're testing against production:

1. Go to [Stripe Dashboard Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Find your webhook endpoint
3. Click "Reveal" next to "Signing secret"
4. Copy the secret
5. Update your `.env` file with that secret
6. Note: This only works if your backend URL matches the webhook URL in Stripe

---

## 🧪 Verification Tools

We've created tools to help you diagnose webhook issues:

### 1. Quick Test

```bash
node test-webhook.js
```

Checks environment variables and endpoint accessibility.

### 2. Comprehensive Verification

```bash
node verify-webhook.js
```

- Lists all webhooks configured in Stripe
- Validates webhook secrets
- Tests endpoint accessibility
- Provides detailed recommendations

---

## 📊 Events Your Webhook Handles

Your backend listens for these Stripe events:

1. **`payment_intent.succeeded`**

   - Confirms booking payments
   - Confirms download payments
   - Updates payment status to COMPLETED

2. **`payment_intent.payment_failed`**

   - Updates payment status to FAILED

3. **`charge.refunded`**
   - Updates payment status to REFUNDED or PARTIALLY_REFUNDED
   - Updates booking payment status

---

## 🐛 Debugging Failed Webhooks

If webhooks still aren't working after setup:

### 1. Check Backend Logs

Look for webhook-related errors:

```bash
# Your backend should log incoming webhook events
```

### 2. Check Stripe Dashboard

Go to: [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)

- Click on your webhook endpoint
- View recent webhook attempts
- Check for failed deliveries
- See error messages

### 3. Test Webhook Endpoint Manually

```bash
curl -X POST http://localhost:8081/api/v1/payments/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

Should return 400 with "Missing stripe-signature header" (this is correct!)

### 4. Verify Environment Variables

```bash
# Run verification script
node verify-webhook.js
```

---

## 🔒 Security Notes

1. **Never commit webhook secrets** to version control
2. **Use different secrets** for test and live mode
3. **Webhook secrets** should start with `whsec_`
4. **Stripe CLI secrets** are temporary and only work locally
5. **Production webhooks** require a publicly accessible URL (not localhost)

---

## 📝 Next Steps

1. ✅ **Fixed**: Raw body middleware configured in `main.ts`
2. ✅ **Created**: Verification tools (`test-webhook.js`, `verify-webhook.js`)
3. ✅ **Created**: Setup script (`setup-local-webhooks.sh`)
4. ⏳ **Action Required**: Set up Stripe CLI webhook forwarding
5. ⏳ **Action Required**: Update `STRIPE_WEBHOOK_SECRET` in `.env`
6. ⏳ **Action Required**: Restart backend server
7. ⏳ **Action Required**: Test payment flow

---

## 🎯 Expected Results After Fix

Once webhooks are properly configured:

1. ✅ Payments will show up immediately in Stripe dashboard
2. ✅ Backend will receive webhook events
3. ✅ Payment status will update in your database
4. ✅ Download links will be sent via email
5. ✅ Booking confirmations will be processed

---

## 💡 Pro Tips

1. **Keep Stripe CLI running** while developing
2. **Monitor webhook logs** in Stripe Dashboard
3. **Use `stripe trigger`** to simulate events without making real payments
4. **Check backend logs** for webhook processing errors
5. **Verify payment status** in both Stripe and your database

---

## 🆘 Still Having Issues?

If webhooks still don't work after following these steps:

1. Check if your backend is running on port 8081
2. Verify no firewall is blocking the connection
3. Ensure you restarted the backend after updating `.env`
4. Check for any error logs in your backend console
5. Run `node verify-webhook.js` to see detailed diagnostics

---

## 📚 Additional Resources

- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Testing Webhooks Locally](https://stripe.com/docs/webhooks/test)
- [Webhook Event Types](https://stripe.com/docs/api/events/types)
