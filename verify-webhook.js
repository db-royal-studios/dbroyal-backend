/**
 * Comprehensive Stripe Webhook Verification Script
 *
 * This script will:
 * 1. Check environment configuration
 * 2. Test webhook endpoint
 * 3. List webhooks configured in Stripe
 * 4. Provide setup instructions
 */

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8081";
const WEBHOOK_ENDPOINT = "/api/v1/payments/stripe/webhook";

async function verifyWebhook() {
  console.log("╔═══════════════════════════════════════════════════════╗");
  console.log("║     🔍 STRIPE WEBHOOK VERIFICATION TOOL 🔍            ║");
  console.log("╚═══════════════════════════════════════════════════════╝\n");

  // Step 1: Check Environment
  console.log("📋 STEP 1: Environment Configuration");
  console.log("─".repeat(60));

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const isTestMode = secretKey?.startsWith("sk_test_");
  const isLiveMode = secretKey?.startsWith("sk_live_");

  console.log(
    `   Secret Key:        ${secretKey ? "✅ Configured" : "❌ Missing"}`,
  );
  console.log(
    `   Webhook Secret:    ${webhookSecret ? "✅ Configured" : "❌ Missing"}`,
  );
  console.log(
    `   Mode:              ${isTestMode ? "🧪 TEST MODE" : isLiveMode ? "🔴 LIVE MODE" : "❓ Unknown"}`,
  );
  console.log(`   Backend URL:       ${BACKEND_URL}${WEBHOOK_ENDPOINT}\n`);

  if (!secretKey || !webhookSecret) {
    console.log("❌ Missing required environment variables. Please configure:");
    console.log("   - STRIPE_SECRET_KEY");
    console.log("   - STRIPE_WEBHOOK_SECRET\n");
    return;
  }

  // Step 2: List Stripe Webhooks
  console.log("📋 STEP 2: Webhooks Configured in Stripe");
  console.log("─".repeat(60));

  try {
    const webhooks = await stripe.webhookEndpoints.list({ limit: 10 });

    if (webhooks.data.length === 0) {
      console.log("   ⚠️  No webhooks configured in Stripe Dashboard\n");
      console.log("   To configure a webhook:");
      console.log(
        `   1. Go to: https://dashboard.stripe.com/${isTestMode ? "test/" : ""}webhooks`,
      );
      console.log('   2. Click "Add endpoint"');
      console.log(
        `   3. Enter endpoint URL: ${BACKEND_URL}${WEBHOOK_ENDPOINT}`,
      );
      console.log("   4. Select events:");
      console.log("      - payment_intent.succeeded");
      console.log("      - payment_intent.payment_failed");
      console.log("      - charge.refunded");
      console.log(
        "   5. Copy the signing secret to STRIPE_WEBHOOK_SECRET in .env\n",
      );
    } else {
      console.log(`   Found ${webhooks.data.length} webhook(s):\n`);

      webhooks.data.forEach((webhook, index) => {
        console.log(`   ${index + 1}. ${webhook.url}`);
        console.log(
          `      Status: ${webhook.status === "enabled" ? "✅ Enabled" : "❌ Disabled"}`,
        );
        console.log(`      Events: ${webhook.enabled_events.length}`);
        console.log(`      Events: ${webhook.enabled_events.join(", ")}`);
        console.log(
          `      Secret: whsec_${webhook.secret?.substring(6, 16)}...`,
        );
        console.log();
      });

      // Check if our endpoint matches any configured webhook
      const matchingWebhook = webhooks.data.find(
        (wh) =>
          wh.url.includes("localhost:8081") || wh.url.includes(BACKEND_URL),
      );

      if (matchingWebhook) {
        console.log("   ✅ Found matching webhook for your backend!\n");
      } else {
        console.log("   ⚠️  No webhook found matching your backend URL");
        console.log(`   Expected: ${BACKEND_URL}${WEBHOOK_ENDPOINT}\n`);
      }
    }
  } catch (error) {
    console.log(`   ❌ Error listing webhooks: ${error.message}\n`);
  }

  // Step 3: Test Endpoint Accessibility
  console.log("📋 STEP 3: Backend Endpoint Accessibility");
  console.log("─".repeat(60));

  try {
    const response = await fetch(`${BACKEND_URL}${WEBHOOK_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ test: "ping" }),
    });

    console.log(`   Endpoint:    ${BACKEND_URL}${WEBHOOK_ENDPOINT}`);
    console.log(`   Status:      ${response.status} ${response.statusText}`);

    if (response.status === 400) {
      const data = await response.json().catch(() => ({}));
      if (
        data.message?.includes("stripe-signature") ||
        data.message?.includes("Missing")
      ) {
        console.log(
          "   Result:      ✅ Endpoint accessible (requires Stripe signature)",
        );
      } else {
        console.log(
          "   Result:      ⚠️  Endpoint accessible but unexpected response",
        );
        console.log(`   Message:     ${data.message || "No message"}`);
      }
    } else {
      console.log("   Result:      ⚠️  Unexpected response");
    }
  } catch (error) {
    console.log(`   ❌ Cannot reach endpoint: ${error.message}`);
    console.log("   Make sure your backend is running!");
  }

  console.log();

  // Step 4: Webhook Secret Validation
  console.log("📋 STEP 4: Webhook Secret Validation");
  console.log("─".repeat(60));

  if (webhookSecret?.startsWith("whsec_")) {
    console.log("   ✅ Webhook secret format is valid");

    // Check if the webhook secret matches any configured webhook
    try {
      const webhooks = await stripe.webhookEndpoints.list({ limit: 10 });
      const matchingSecret = webhooks.data.find(
        (wh) => webhookSecret === wh.secret,
      );

      if (matchingSecret) {
        console.log("   ✅ Webhook secret matches a configured endpoint");
        console.log(`   ✅ Endpoint URL: ${matchingSecret.url}`);
      } else if (webhookSecret.startsWith("whsec_")) {
        console.log(
          "   ⚠️  Webhook secret does not match any configured endpoint",
        );
        console.log("   This might be a local Stripe CLI webhook secret");
      }
    } catch (error) {
      console.log(`   ⚠️  Could not verify webhook secret: ${error.message}`);
    }
  } else {
    console.log(
      '   ❌ Webhook secret format is invalid (should start with "whsec_")',
    );
  }

  console.log();

  // Summary
  console.log("╔═══════════════════════════════════════════════════════╗");
  console.log("║                    📝 SUMMARY                         ║");
  console.log("╚═══════════════════════════════════════════════════════╝\n");

  const issues = [];
  const suggestions = [];

  if (!secretKey) issues.push("Missing STRIPE_SECRET_KEY");
  if (!webhookSecret) issues.push("Missing STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret?.startsWith("whsec_"))
    issues.push("Invalid webhook secret format");

  try {
    const webhooks = await stripe.webhookEndpoints.list({ limit: 1 });
    if (webhooks.data.length === 0) {
      suggestions.push("No webhooks configured in Stripe Dashboard");
    }
  } catch (error) {}

  if (issues.length > 0) {
    console.log("❌ Issues Found:");
    issues.forEach((issue) => console.log(`   • ${issue}`));
    console.log();
  }

  if (suggestions.length > 0) {
    console.log("💡 Suggestions:");
    suggestions.forEach((suggestion) => console.log(`   • ${suggestion}`));
    console.log();
  }

  if (issues.length === 0 && suggestions.length === 0) {
    console.log("✅ All checks passed! Your webhook should be working.\n");
    console.log("🧪 To test webhooks locally:");
    console.log(
      "   stripe listen --forward-to localhost:8081/api/v1/payments/stripe/webhook",
    );
    console.log();
    console.log("🧪 To trigger a test event:");
    console.log("   stripe trigger payment_intent.succeeded");
    console.log();
  } else {
    console.log("📚 Setup Instructions:");
    console.log();
    console.log("Option 1: Use Stripe CLI for local testing");
    console.log("─".repeat(60));
    console.log("1. Install Stripe CLI: brew install stripe/stripe-cli/stripe");
    console.log("2. Login: stripe login");
    console.log("3. Forward events:");
    console.log(
      "   stripe listen --forward-to localhost:8081/api/v1/payments/stripe/webhook",
    );
    console.log("4. Copy the webhook signing secret (starts with whsec_)");
    console.log("5. Update STRIPE_WEBHOOK_SECRET in .env");
    console.log();
    console.log("Option 2: Configure in Stripe Dashboard");
    console.log("─".repeat(60));
    console.log(
      `1. Go to: https://dashboard.stripe.com/${isTestMode ? "test/" : ""}webhooks`,
    );
    console.log('2. Click "Add endpoint"');
    console.log("3. Enter your public URL (not localhost)");
    console.log(
      "4. Select events: payment_intent.succeeded, payment_intent.payment_failed, charge.refunded",
    );
    console.log("5. Copy the signing secret to STRIPE_WEBHOOK_SECRET in .env");
    console.log();
  }
}

verifyWebhook().catch(console.error);
