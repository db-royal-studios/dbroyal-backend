/**
 * Test Payment Flow - Diagnostic Script
 *
 * This script helps diagnose why frontend payments aren't triggering webhooks
 */

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8081";

async function testPaymentFlow() {
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║       🧪 PAYMENT FLOW DIAGNOSTIC TEST 🧪               ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_");
  console.log(`Mode: ${isTestMode ? "🧪 TEST" : "🔴 LIVE"}\n`);

  try {
    // Step 1: Create a test payment intent
    console.log("1️⃣  Creating test payment intent...");
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // $10.00
      currency: "gbp",
      metadata: {
        test: "diagnostic",
        timestamp: new Date().toISOString(),
      },
      description: "Test payment for webhook diagnostic",
    });

    console.log(`   ✅ Payment Intent Created: ${paymentIntent.id}`);
    console.log(`   Status: ${paymentIntent.status}`);
    console.log(`   Amount: £${paymentIntent.amount / 100}`);
    console.log(
      `   Client Secret: ${paymentIntent.client_secret?.substring(0, 20)}...\n`,
    );

    // Step 2: Check if Stripe CLI is forwarding webhooks
    console.log("2️⃣  Checking webhook configuration...");
    const webhooks = await stripe.webhookEndpoints.list({ limit: 10 });

    console.log(`   Found ${webhooks.data.length} webhook(s):`);
    webhooks.data.forEach((wh, i) => {
      console.log(`   ${i + 1}. ${wh.url}`);
      console.log(`      Status: ${wh.status}`);
      console.log(
        `      Events: ${wh.enabled_events.slice(0, 3).join(", ")}${wh.enabled_events.length > 3 ? "..." : ""}`,
      );
    });
    console.log();

    // Step 3: Simulate payment confirmation
    console.log("3️⃣  Simulating payment confirmation...");
    console.log("   ⚠️  Note: This will trigger webhook events!\n");

    // Confirm the payment intent
    const confirmed = await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: "pm_card_visa", // Test card
      return_url: `${BACKEND_URL}/payment-complete`,
    });

    console.log(`   ✅ Payment Confirmed: ${confirmed.status}`);

    if (confirmed.status === "succeeded") {
      console.log("   ✅ Payment succeeded - webhook should fire!\n");
    } else if (confirmed.status === "requires_action") {
      console.log("   ⚠️  Payment requires additional action");
      console.log(
        "   🔗 Next action URL:",
        confirmed.next_action?.redirect_to_url?.url || "N/A\n",
      );
    } else {
      console.log(`   ⚠️  Payment status: ${confirmed.status}\n`);
    }

    // Step 4: Wait and check for webhook events
    console.log("4️⃣  Checking recent webhook events (last 10)...");
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds

    const events = await stripe.events.list({
      limit: 10,
      types: ["payment_intent.succeeded", "payment_intent.payment_failed"],
    });

    console.log(`   Found ${events.data.length} recent payment events:\n`);
    events.data.forEach((evt, i) => {
      const pi = evt.data.object;
      console.log(`   ${i + 1}. ${evt.type}`);
      console.log(`      Event ID: ${evt.id}`);
      console.log(`      Payment Intent: ${pi.id}`);
      console.log(
        `      Amount: ${pi.currency.toUpperCase()} ${pi.amount / 100}`,
      );
      console.log(
        `      Time: ${new Date(evt.created * 1000).toLocaleString()}`,
      );
      console.log();
    });

    // Step 5: Check backend endpoint
    console.log("5️⃣  Testing backend webhook endpoint...");
    const response = await fetch(
      `${BACKEND_URL}/api/v1/payments/stripe/webhook`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: "ping" }),
      },
    );

    console.log(`   Endpoint: ${BACKEND_URL}/api/v1/payments/stripe/webhook`);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(
      `   Result: ${response.status === 400 ? "✅ Accessible" : "⚠️  Unexpected"}\n`,
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.code) {
      console.error("   Code:", error.code);
    }
    if (error.type) {
      console.error("   Type:", error.type);
    }
  }

  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║                   📋 CHECKLIST                         ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  console.log("To ensure webhooks work from frontend:");
  console.log("");
  console.log("1. ✓ Stripe CLI must be running:");
  console.log(
    "   stripe listen --forward-to localhost:8081/api/v1/payments/stripe/webhook\n",
  );

  console.log("2. ✓ Backend must be running on port 8081\n");

  console.log("3. ✓ STRIPE_WEBHOOK_SECRET in .env must match CLI secret\n");

  console.log("4. ✓ Frontend must use matching publishable key:");
  console.log(
    `   ${isTestMode ? "pk_test_..." : "pk_live_..."} (${isTestMode ? "TEST" : "LIVE"} mode)\n`,
  );

  console.log(
    "5. ✓ Frontend must CONFIRM the payment (not just create intent)\n",
  );

  console.log("6. ✓ Check Stripe CLI terminal for incoming webhook events\n");

  console.log("7. ✓ Check backend logs for webhook processing:\n");
  console.log("   Look for: 🔔 Webhook received...\n");
}

testPaymentFlow().catch(console.error);
