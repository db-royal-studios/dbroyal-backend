#!/bin/bash

# Stripe CLI Local Testing Setup
# This script helps you set up Stripe webhooks for local development

echo "╔════════════════════════════════════════════════════════╗"
echo "║   🔧 STRIPE LOCAL WEBHOOK SETUP                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo "❌ Stripe CLI is not installed"
    echo ""
    echo "To install Stripe CLI:"
    echo "  brew install stripe/stripe-cli/stripe"
    echo ""
    exit 1
fi

echo "✅ Stripe CLI is installed"
echo ""

# Check if logged in
if ! stripe config --list &> /dev/null; then
    echo "🔐 You need to login to Stripe CLI"
    echo "Run: stripe login"
    echo ""
    exit 1
fi

echo "✅ Logged in to Stripe"
echo ""

# Instructions
echo "📋 SETUP INSTRUCTIONS:"
echo "────────────────────────────────────────────────────────"
echo ""
echo "1️⃣  Run this command in a NEW TERMINAL:"
echo ""
echo "    stripe listen --forward-to localhost:8081/api/v1/payments/stripe/webhook"
echo ""
echo "2️⃣  Copy the webhook signing secret (starts with whsec_)"
echo ""
echo "3️⃣  Update your .env file:"
echo "    STRIPE_WEBHOOK_SECRET=whsec_xxxxx"
echo ""
echo "4️⃣  Restart your backend server"
echo ""
echo "5️⃣  Test with:"
echo "    stripe trigger payment_intent.succeeded"
echo ""
echo "────────────────────────────────────────────────────────"
echo ""
echo "Would you like to start listening now? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo ""
    echo "🎧 Starting Stripe webhook listener..."
    echo "⚠️  Keep this terminal open!"
    echo "⚠️  Copy the webhook signing secret and update .env"
    echo ""
    stripe listen --forward-to localhost:8081/api/v1/payments/stripe/webhook
fi
