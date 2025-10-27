# 🚀 RewardAI SDK - Complete Publishing Guide

## Step 1: Set Up GitHub Repository

### Create the Repository on GitHub
1. Go to https://github.com/new
2. Repository name: `rewardai-sdk`
3. Description: `TypeScript SDK for distributing Pump.fun token rewards via Coinbase x402`
4. Choose: **Public**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Initialize and Push to GitHub

```bash
cd /Users/beigesmacbookpro/Dropbox/Goldpill.org/ReactProjects/NOAH/pumpbuddy-sdk/pumpbuddy-sdk-clean

# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: RewardAI SDK v0.1.0"

# Add GitHub remote (replace 'beigecode' with your GitHub username if different)
git remote add origin https://github.com/beigecode/rewardai-sdk.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Verify npm Login

```bash
# Check if you're logged in
npm whoami

# If not logged in, run:
# npm login
```

## Step 3: Publish to npm

### Option A: Automated Publishing (Recommended)

```bash
cd /Users/beigesmacbookpro/Dropbox/Goldpill.org/ReactProjects/NOAH/pumpbuddy-sdk/pumpbuddy-sdk-clean

# Make script executable
chmod +x publish.sh

# Run publish script
./publish.sh
```

The script will:
- ✅ Verify npm login
- ✅ Install dependencies
- ✅ Build packages
- ✅ Ask for confirmation
- ✅ Publish both packages

### Option B: Manual Publishing

```bash
cd /Users/beigesmacbookpro/Dropbox/Goldpill.org/ReactProjects/NOAH/pumpbuddy-sdk/pumpbuddy-sdk-clean

# Build first
npm run build

# Publish SDK
cd packages/sdk
npm publish --access public

# Publish CLI
cd ../cli
npm publish --access public
```

## Step 4: Verify Publication

After publishing, verify your packages are live:

- **SDK**: https://www.npmjs.com/package/rewardai-sdk
- **CLI**: https://www.npmjs.com/package/rewardai

## Step 5: Test Installation

```bash
# Test SDK installation
npm install rewardai-sdk

# Test CLI installation
npm install -g rewardai
rewardai --version
```

## Step 6: Create GitHub Release

1. Go to https://github.com/beigecode/rewardai-sdk/releases/new
2. Tag version: `v0.1.0`
3. Release title: `RewardAI SDK v0.1.0`
4. Description:
   ```markdown
   # 🎉 RewardAI SDK v0.1.0

   First public release of RewardAI SDK - TypeScript SDK for distributing Pump.fun token rewards via Coinbase x402.

   ## 📦 Packages

   - **rewardai-sdk** - Core SDK for programmatic integration
   - **rewardai** - CLI tool for quick distributions

   ## ✨ Features

   - Coinbase x402 payment integration
   - Solana token distribution
   - TypeScript support with full type definitions
   - Interactive CLI with colorful output

   ## 📚 Installation

   \`\`\`bash
   # SDK
   npm install rewardai-sdk

   # CLI
   npm install -g rewardai
   \`\`\`

   ## 🔗 Links

   - [npm: rewardai-sdk](https://www.npmjs.com/package/rewardai-sdk)
   - [npm: rewardai](https://www.npmjs.com/package/rewardai)
   - [Documentation](https://github.com/beigecode/rewardai-sdk#readme)
   ```
5. Click "Publish release"

## 🎯 Next Steps

1. Update your marketing website with npm install commands
2. Update README badges with actual version numbers
3. Announce on social media
4. Monitor npm downloads and GitHub stars

## 🐛 Troubleshooting

### Package name already taken?
If `rewardai-sdk` or `rewardai` are taken, use scoped packages:

```json
// packages/sdk/package.json
{
  "name": "@beigecode/rewardai-sdk"
}

// packages/cli/package.json
{
  "name": "@beigecode/rewardai"
}
```

Then update imports in CLI to use `@beigecode/rewardai-sdk`.

### Permission denied?
Make sure you're logged in to npm and have publish permissions:
```bash
npm login
npm whoami
```

### Network error?
Check your internet connection and try again in a few minutes.

---

**Ready?** Start with Step 1 above! 🚀

