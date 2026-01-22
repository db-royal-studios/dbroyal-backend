/**
 * Test Stripe Webhook Configuration
 *
 * This script checks:
 * 1. Environment variables are set correctly
 * 2. Webhook endpoint is accessible
 * 3. Webhook secret is valid
 */

require("dotenv").config();

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8081";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

console.log("🔍 Checking Stripe Webhook Configuration...\n");

// Check 1: Environment Variables
console.log("1️⃣ Environment Variables:");
console.log(
  `   STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY ? "✅ Set (" + STRIPE_SECRET_KEY.substring(0, 12) + "...)" : "❌ Missing"}`,
);
console.log(
  `   STRIPE_WEBHOOK_SECRET: ${WEBHOOK_SECRET ? "✅ Set (" + WEBHOOK_SECRET.substring(0, 12) + "...)" : "❌ Missing"}`,
);
console.log(
  `   Key Type: ${STRIPE_SECRET_KEY?.startsWith("sk_test_") ? "🧪 TEST MODE" : STRIPE_SECRET_KEY?.startsWith("sk_live_") ? "🔴 LIVE MODE" : "❓ Unknown"}`,
);
console.log(
  `   Webhook Secret Type: ${WEBHOOK_SECRET?.startsWith("whsec_") ? "✅ Valid format" : "❌ Invalid format"}\n`,
);

// Check 2: Webhook Endpoint Accessibility
console.log("2️⃣ Webhook Endpoint:");
console.log(`   URL: ${BACKEND_URL}/api/v1/payments/stripe/webhook`);
console.log("   Testing accessibility...");

fetch(`${BACKEND_URL}/api/v1/payments/stripe/webhook`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ test: "ping" }),
})
  .then((response) => {
    console.log(`   Status: ${response.status} ${response.statusText}`);

    if (response.status === 400) {
      return response.json().then((data) => {
        console.log(
          "   ✅ Endpoint is accessible (expected 400 for test payload)",
        );
        console.log("   Response:", JSON.stringify(data, null, 2));
      });
    } else {
      console.log(`   ⚠️  Unexpected status: ${response.status}`);
    }
  })
  .catch((error) => {
    console.log(`   ❌ Cannot reach endpoint: ${error.message}`);
    console.log("   Make sure your backend is running on port 8081");
  })
  .finally(() => {
    console.log("\n3️⃣ Next Steps:");
    console.log("   • Ensure backend is running: npm run start:dev");
    console.log("   • Use Stripe CLI to test webhooks:");
    console.log(
      "     stripe listen --forward-to localhost:8081/api/v1/payments/stripe/webhook",
    );
    console.log(
      "   • Update STRIPE_WEBHOOK_SECRET with the webhook signing secret from Stripe CLI",
    );
    console.log("   • Or configure webhook in Stripe Dashboard:");
    console.log("     https://dashboard.stripe.com/test/webhooks");
    console.log(
      "     Endpoint: http://your-domain.com/api/v1/payments/stripe/webhook",
    );
    console.log(
      "     Events: payment_intent.succeeded, payment_intent.payment_failed, charge.refunded",
    );
  });
