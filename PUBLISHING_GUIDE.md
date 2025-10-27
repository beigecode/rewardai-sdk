# Publishing PumpBuddy SDK to npm

This guide walks you through publishing both the SDK and CLI packages to npm.

## Prerequisites

1. **npm account** - Create one at https://www.npmjs.com/signup
2. **npm authentication** - Run `npm login` and enter your credentials
3. **Package names available** - Check if names are taken:
   - `@pumpbuddy/sdk` (scoped package)
   - `pumpbuddy` (CLI package)

## Step-by-Step Publishing

### 1. Login to npm

```bash
npm login
# Enter your npm username, password, and email
```

Verify you're logged in:
```bash
npm whoami
# Should show your npm username
```

### 2. Build the Packages

```bash
cd /Users/beigesmacbookpro/Dropbox/Goldpill.org/ReactProjects/NOAH/pumpbuddy-sdk/pumpbuddy-sdk-clean

# Install dependencies
npm install

# Build both packages
npm run build
```

This will:
- Install all dependencies (including SDK and CLI deps)
- Compile TypeScript to JavaScript in `dist/` folders
- Generate type definitions (.d.ts files)

### 3. Test Locally (Optional but Recommended)

Before publishing, test the packages locally:

```bash
# Test SDK
cd packages/sdk
npm pack
# This creates a .tgz file you can test with: npm install /path/to/pumpbuddy-sdk-0.1.0.tgz

# Test CLI
cd ../cli
npm pack
```

### 4. Publish SDK Package

```bash
cd packages/sdk

# Publish to npm (public access required for scoped packages)
npm publish --access public
```

Expected output:
```
+ @pumpbuddy/sdk@0.1.0
```

### 5. Publish CLI Package

```bash
cd ../cli

# Publish to npm
npm publish --access public
```

Expected output:
```
+ pumpbuddy@0.1.0
```

### 6. Verify Publication

Check your packages on npm:
- SDK: https://www.npmjs.com/package/@pumpbuddy/sdk
- CLI: https://www.npmjs.com/package/pumpbuddy

Test installation:
```bash
# Test SDK
npm install @pumpbuddy/sdk

# Test CLI globally
npm install -g pumpbuddy
pumpbuddy --version
```

## Troubleshooting

### Error: Package name already taken

If `@pumpbuddy/sdk` or `pumpbuddy` is taken, you have options:

**Option 1: Use your own scope**
```json
// packages/sdk/package.json
{
  "name": "@beigecode/pumpbuddy-sdk"
}

// packages/cli/package.json
{
  "name": "@beigecode/pumpbuddy"
}
```

**Option 2: Add suffix**
```json
{
  "name": "pumpbuddy-cli"
}
```

### Error: You must be logged in

Run `npm login` and enter your credentials.

### Error: 402 Payment Required

Your npm account might need verification. Check your email or npm account settings.

### Error: No permission to publish

Make sure you own the package name or have permission to publish under that scope.

### Build fails

```bash
# Clean and rebuild
rm -rf node_modules package-lock.json
rm -rf packages/*/node_modules packages/*/dist
npm install
npm run build
```

## Updating Packages (Future Versions)

### 1. Update version numbers

```bash
# SDK
cd packages/sdk
npm version patch  # or minor, major

# CLI
cd ../cli
npm version patch
```

### 2. Update CHANGELOG.md

Document your changes in the root CHANGELOG.md

### 3. Rebuild and republish

```bash
cd ../..
npm run build

cd packages/sdk
npm publish --access public

cd ../cli
npm publish --access public
```

### 4. Create Git tag

```bash
git add .
git commit -m "Release v0.1.1"
git tag v0.1.1
git push origin main --tags
```

## Automated Publishing with GitHub Actions

Your repo already has `.github/workflows/ci.yml`. To enable automated npm publishing:

1. **Create npm access token**:
   - Go to https://www.npmjs.com/settings/[username]/tokens
   - Create new token (Automation)
   - Copy the token

2. **Add to GitHub Secrets**:
   - Go to your repo: https://github.com/beigecode/pumpbuddy-sdk/settings/secrets/actions
   - New repository secret: `NPM_TOKEN`
   - Paste your npm token

3. **Create release on GitHub**:
   - Go to https://github.com/beigecode/pumpbuddy-sdk/releases/new
   - Create tag: `v0.1.0`
   - Title: `Release v0.1.0`
   - Click "Publish release"
   - GitHub Action will automatically publish to npm

## Quick Commands Reference

```bash
# Login
npm login

# Build
npm install && npm run build

# Publish SDK
cd packages/sdk && npm publish --access public

# Publish CLI
cd packages/cli && npm publish --access public

# Test installation
npm install -g pumpbuddy
pumpbuddy --version

# Update version
npm version patch

# Create release
git tag v0.1.1 && git push origin v0.1.1
```

## Package URLs After Publishing

- **SDK Package**: https://www.npmjs.com/package/@pumpbuddy/sdk
- **CLI Package**: https://www.npmjs.com/package/pumpbuddy
- **GitHub Repo**: https://github.com/beigecode/pumpbuddy-sdk

---

**Ready to publish?** Start with Step 1: `npm login`

