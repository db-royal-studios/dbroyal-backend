#!/bin/bash

# Payment Integration Setup Script

echo "🚀 Setting up Payment Integration..."
echo ""

# Step 1: Install Stripe package
echo "📦 Installing Stripe package..."
npm install stripe

# Step 2: Check environment variables
echo ""
echo "🔐 Checking environment variables..."

if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please update with your credentials:"
    echo "   - STRIPE_SECRET_KEY"
    echo "   - STRIPE_WEBHOOK_SECRET"
    echo "   - NG_BANK_NAME"
    echo "   - NG_ACCOUNT_NUMBER"
    echo "   - NG_ACCOUNT_NAME"
else
    echo "✅ .env file exists"
fi

# Step 3: Run Prisma migration
echo ""
echo "📊 Running database migration..."
npx prisma migrate dev --name add_payment_support

# Step 4: Generate Prisma client
echo ""
echo "🔧 Generating Prisma client..."
npx prisma generate

# Step 5: Summary
echo ""
echo "✨ Payment integration setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Update .env with your Stripe credentials"
echo "   2. Configure Stripe webhook endpoint"
echo "   3. Update Nigeria bank account details in .env"
echo "   4. Restart your development server"
echo ""
echo "📚 Documentation: docs/PAYMENT_INTEGRATION.md"
echo ""
