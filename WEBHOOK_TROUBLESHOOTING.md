# 🔍 Frontend Payment Webhook Diagnostic

## Current Status

✅ **Working:**

- Payments are being created in Stripe
- Payments are showing on Stripe Dashboard
- Payment intents are succeeding
- Backend webhook endpoint is accessible
- Webhook logging is enabled

## 🎯 The Issue

**Frontend payments don't trigger webhooks, but Stripe CLI `trigger` command works.**

This indicates: **Stripe CLI listener may not be running or not receiving events from Stripe's servers.**

---

## 🔧 Root Cause Analysis

### Scenario 1: Stripe CLI Not Running (Most Likely)

When you make a payment from the frontend:

1. ✅ Payment is created in Stripe
2. ✅ Payment is confirmed
3. ✅ Stripe Dashboard shows the payment
4. ❌ **Stripe CLI is not forwarding the event to your local backend**
5. ❌ Your backend never receives the webhook

**Why `stripe trigger` works:**

- `stripe trigger` generates events locally and sends them directly to your backend
- It doesn't rely on Stripe's servers sending real webhook events

**Solution:** Start the Stripe CLI listener in a **separate terminal window** and **keep it running**:

\`\`\`bash
stripe listen --forward-to localhost:8081/api/v1/payments/stripe/webhook
\`\`\`

### Scenario 2: Production Webhook Configured

Your Stripe account has a webhook pointing to production:

- **URL:** `https://dbroyal-backend-db-royal-studios1114-g4qym111.leapcell.dev/payments/stripe/webhook`

When you make a payment:

1. ✅ Stripe sends webhook to production URL
2. ❌ NOT sent to `localhost:8081` (your local backend)

**Solution:** Use Stripe CLI to forward events to localhost (for local development).

---

## ✅ Step-by-Step Fix

### 1. Check if Stripe CLI Listener is Running

Open the terminal where you ran the webhook setup script. You should see:

\`\`\`

> Ready! You are using Stripe API Version [2025-04-30.basil].
> Your webhook signing secret is whsec\_...
> \`\`\`

**If you don't see this:** The listener is not running!

### 2. Start Stripe CLI Listener (in a NEW terminal)

\`\`\`bash

# Open a NEW terminal window

stripe listen --forward-to localhost:8081/api/v1/payments/stripe/webhook
\`\`\`

**Important:** This terminal must stay open while you're testing!

### 3. Update Webhook Secret

When you start the listener, it will show:
\`\`\`
Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxxxxxx
\`\`\`

Update your `.env` file with this secret:
\`\`\`env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
\`\`\`

### 4. Restart Your Backend

After updating `.env`, restart your backend server to pick up the new webhook secret.

### 5. Test Payment from Frontend

Now when you make a payment from your frontend:

**In Stripe CLI terminal, you should see:**
\`\`\`
[200] POST /api/v1/payments/stripe/webhook [evt_xxxxx]
\`\`\`

**In backend logs, you should see:**
\`\`\`
🔔 Webhook received at: 2026-01-21T...
✅ Webhook verified, event type: payment_intent.succeeded
💳 Payment Intent Succeeded: pi_xxxxxxx
\`\`\`

---

## 🐛 Debugging Checklist

### ✓ Check Stripe CLI is Running

\`\`\`bash

# In the terminal where you started stripe listen

# You should see it waiting for events

# If you see nothing, it's not running

\`\`\`

### ✓ Check Backend is Running

\`\`\`bash
curl http://localhost:8081/api/v1/payments/stripe/webhook

# Should return: {"statusCode":400,"message":"Missing stripe-signature header"}

\`\`\`

### ✓ Check Frontend Publishable Key

Your frontend must use the **test** publishable key (starts with `pk_test_`), not the live key.

Get it from: [Stripe Dashboard - API Keys](https://dashboard.stripe.com/test/apikeys)

### ✓ Check Frontend Payment Confirmation

Make sure your frontend code **confirms** the payment, not just creates the intent.

Example frontend code:
\`\`\`javascript
// ❌ Bad - Only creates intent (no webhook triggered yet)
const { data } = await axios.post('/api/v1/payments/downloads/xxx/stripe', {
amount: 7500,
currency: 'gbp'
});

// ✅ Good - Confirms payment (triggers webhook)
const { error } = await stripe.confirmCardPayment(data.clientSecret, {
payment_method: {
card: cardElement,
billing_details: { name: 'Customer Name' }
}
});
\`\`\`

---

## 📊 What to Look For

### When Payment Works Correctly:

**1. Stripe CLI Terminal:**
\`\`\`
2026-01-21 17:31:46 --> payment_intent.succeeded [evt_xxxxx]
2026-01-21 17:31:46 <-- [200] POST http://localhost:8081/api/v1/payments/stripe/webhook [evt_xxxxx]
\`\`\`

**2. Backend Logs:**
\`\`\`
🔔 Webhook received at: 2026-01-21T17:31:46.000Z
📝 Signature present: true
📦 Body present: true
✅ Webhook verified, event type: payment_intent.succeeded
🆔 Event ID: evt_xxxxx
💳 Payment Intent Succeeded: pi_xxxxx (75 gbp)
📥 Found download payment: dl_xxxxx
✅ Download payment confirmed
✅ Webhook processed successfully
\`\`\`

**3. Database:**

- Payment status updated to `COMPLETED`
- Download link sent via email

### If Not Working:

**Stripe CLI shows nothing:**

- ❌ CLI listener is not running
- **Fix:** Run `stripe listen --forward-to localhost:8081/api/v1/payments/stripe/webhook`

**Backend shows nothing:**

- ❌ Webhook not reaching backend
- **Fix:** Check backend is running and STRIPE_WEBHOOK_SECRET matches

**Backend shows error:**

- ❌ Webhook signature verification failed
- **Fix:** Update STRIPE_WEBHOOK_SECRET to match CLI secret

---

## 🎬 Quick Test

Run this to simulate a complete payment flow:

\`\`\`bash

# 1. Start Stripe CLI listener (in terminal 1)

stripe listen --forward-to localhost:8081/api/v1/payments/stripe/webhook

# 2. In a new terminal, trigger a test event

stripe trigger payment_intent.succeeded

# 3. Check Stripe CLI terminal - should show:

# --> payment_intent.succeeded

# <-- [200] POST ...

# 4. Check backend logs - should show:

# 🔔 Webhook received...

\`\`\`

If this test works but frontend doesn't:

- Issue is in frontend payment confirmation
- Frontend might not be completing the payment
- Check browser console for errors

---

## 💡 Common Mistakes

1. **Not keeping Stripe CLI listener running**

   - The listener must stay open in a terminal
   - If you close the terminal, webhooks stop working

2. **Using production webhook secret with test mode**

   - Local .env must use the CLI webhook secret
   - Not the production webhook secret from dashboard

3. **Frontend using wrong publishable key**

   - Test backend (sk*test*) needs test publishable key (pk*test*)
   - Check your frontend environment variables

4. **Frontend not confirming payment**
   - Creating payment intent ≠ completing payment
   - Must call `stripe.confirmCardPayment()` or equivalent

---

## 📞 Next Steps

1. **Open a new terminal** (don't close this one)
2. **Run:** `stripe listen --forward-to localhost:8081/api/v1/payments/stripe/webhook`
3. **Keep it running** (you'll see events flowing through here)
4. **Make a payment** from your frontend
5. **Watch the Stripe CLI terminal** - you should see webhook events
6. **Watch your backend logs** - you should see webhook processing

If you still don't see events in Step 5, the issue is with frontend payment confirmation (Step 4 in Common Mistakes above).
