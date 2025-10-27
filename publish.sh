#!/bin/bash

# RewardAI SDK Publishing Script
# This script helps you publish the SDK and CLI to npm

set -e  # Exit on error

echo "🚀 RewardAI SDK Publishing Script"
echo "===================================="
echo ""

# Check if logged in to npm
if ! npm whoami &> /dev/null; then
    echo "❌ You're not logged in to npm"
    echo "Please run: npm login"
    exit 1
fi

NPM_USER=$(npm whoami)
echo "✅ Logged in as: $NPM_USER"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the rewardai-sdk-clean directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Build packages
echo "🔨 Building packages..."
npm run build
echo ""

# Check if build succeeded
if [ ! -d "packages/sdk/dist" ] || [ ! -d "packages/cli/dist" ]; then
    echo "❌ Build failed - dist directories not found"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Ask for confirmation
echo "📋 Ready to publish:"
echo "   - rewardai-sdk@$(node -p "require('./packages/sdk/package.json').version")"
echo "   - rewardai@$(node -p "require('./packages/cli/package.json').version")"
echo ""
read -p "Continue with publishing? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Publishing cancelled"
    exit 0
fi

# Publish SDK
echo ""
echo "📤 Publishing SDK..."
cd packages/sdk
npm publish --access public
cd ../..
echo "✅ SDK published!"

# Publish CLI
echo ""
echo "📤 Publishing CLI..."
cd packages/cli
npm publish --access public
cd ../..
echo "✅ CLI published!"

echo ""
echo "🎉 Success! Both packages published to npm"
echo ""
echo "📦 View your packages:"
echo "   - SDK: https://www.npmjs.com/package/rewardai-sdk"
echo "   - CLI: https://www.npmjs.com/package/rewardai"
echo ""
echo "🧪 Test installation:"
echo "   npm install rewardai-sdk"
echo "   npm install -g rewardai"
echo ""

