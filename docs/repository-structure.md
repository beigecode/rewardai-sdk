# PumpBuddy SDK - GitHub Repository Structure (SDK Only)

## Repository Overview

**PumpBuddy SDK** - A TypeScript SDK and CLI for distributing Pump.fun creator rewards to token holders using [Coinbase's x402 payment protocol](https://github.com/coinbase/x402) on Solana.

**NPM Packages:**
- `@pumpbuddy/sdk` - Core TypeScript SDK
- `pumpbuddy` - CLI tool for command-line distributions

## Minimal Repository Structure

```
pumpbuddy-sdk/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                  # Test, lint, build
│   │   ├── publish.yml             # Publish to npm
│   │   └── x402-integration.yml    # x402 integration tests
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── x402_issue.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CODEOWNERS
│
├── packages/
│   ├── sdk/                        # @pumpbuddy/sdk
│   │   ├── src/
│   │   │   ├── index.ts            # Main SDK exports
│   │   │   ├── types.ts            # TypeScript types
│   │   │   ├── solana.ts           # Solana helpers
│   │   │   ├── x402.ts             # x402 wrapper
│   │   │   └── x402-integration.ts # Full x402 client
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   └── cli/                        # pumpbuddy CLI
│       ├── src/
│       │   ├── index.ts            # CLI entry point
│       │   ├── commands/
│       │   │   ├── quickstart.ts   # Interactive setup
│       │   │   └── distribute.ts   # Distribution command
│       │   └── utils.ts            # Helpers
│       ├── package.json            # With "bin" field
│       ├── tsconfig.json
│       └── README.md
│
├── examples/
│   ├── basic-distribution.ts       # Simple distribution example
│   ├── x402-payment.ts             # x402 payment example
│   ├── batch-distribution.ts       # Batch processing
│   └── recipients.csv              # Example CSV
│
├── tests/
│   ├── sdk/
│   │   ├── solana.test.ts
│   │   ├── x402.test.ts
│   │   └── distribution.test.ts
│   ├── cli/
│   │   ├── quickstart.test.ts
│   │   └── distribute.test.ts
│   └── integration/
│       └── x402-flow.test.ts
│
├── docs/
│   ├── getting-started.md          # Quick start guide
│   ├── x402-integration.md         # x402 integration details
│   ├── api-reference.md            # SDK API reference
│   ├── cli-reference.md            # CLI commands reference
│   └── examples.md                 # Usage examples
│
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── .npmignore
├── LICENSE                         # MIT
├── package.json                    # Root (workspaces)
├── tsconfig.json
├── lerna.json                      # Optional: for monorepo
│
├── README.md                       # Main SDK README
├── CONTRIBUTING.md
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
└── SECURITY.md
```

## Essential Files

### 1. Root README.md

```markdown
# PumpBuddy SDK

[![npm version](https://badge.fury.io/js/%40pumpbuddy%2Fsdk.svg)](https://www.npmjs.com/package/@pumpbuddy/sdk)
[![Build Status](https://github.com/ORG_NAME/pumpbuddy-sdk/workflows/CI/badge.svg)](https://github.com/ORG_NAME/pumpbuddy-sdk/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with x402](https://img.shields.io/badge/Built%20with-x402-00FF7F)](https://github.com/coinbase/x402)

> Distribute Pump.fun token rewards to your community using [Coinbase x402](https://github.com/coinbase/x402) payment protocol on Solana.

## Features

- 🚀 **TypeScript SDK** - Type-safe API for reward distributions
- 💻 **CLI Tool** - Command-line interface for quick distributions
- 🔗 **x402 Integration** - Secure HTTP-based blockchain payments
- 🏦 **Solana Native** - Built for Pump.fun creator rewards
- 🧪 **Dry-Run Mode** - Test distributions safely
- 📦 **Monorepo** - SDK + CLI in one package

## Quick Start

### Installation

```bash
# Install SDK
npm install @pumpbuddy/sdk

# Install CLI globally
npm install -g pumpbuddy
```

### SDK Usage

```typescript
import { PumpBuddy } from '@pumpbuddy/sdk';

const sdk = new PumpBuddy({ network: 'devnet' });
await sdk.init();

// Fund via x402
const invoice = await sdk.fundViaX402({
  amount: 1000,
  tokenMint: 'YOUR_TOKEN_MINT',
  toVault: 'VAULT_ADDRESS'
});

// Distribute rewards
const result = await sdk.distribute({
  wallet: 'VAULT_ADDRESS',
  tokenMint: 'YOUR_TOKEN_MINT',
  recipients: [
    { wallet: 'holder1...', amount: 20 },
    { wallet: 'holder2...', amount: 30 }
  ],
  dryRun: true // Safe preview mode
});
```

### CLI Usage

```bash
# Interactive quickstart
pumpbuddy quickstart --wallet YOUR_WALLET

# Distribute rewards (dry-run)
pumpbuddy distribute \
  --wallet YOUR_WALLET \
  --token TOKEN_MINT \
  --recipients ./recipients.csv \
  --dry-run

# Real distribution
pumpbuddy distribute \
  --wallet YOUR_WALLET \
  --token TOKEN_MINT \
  --recipients ./recipients.csv \
  --confirm
```

## x402 Payment Protocol

PumpBuddy leverages [Coinbase's x402](https://github.com/coinbase/x402) for secure, HTTP-based blockchain payments:

- **No wallet infrastructure** - Use x402 facilitator for verification & settlement
- **Cryptographic security** - All payments verified on-chain
- **Standard HTTP** - Built on familiar web protocols
- **Production-ready** - Powered by Coinbase infrastructure

[Read the x402 Integration Guide →](docs/x402-integration.md)

## Documentation

- 📖 [Getting Started](docs/getting-started.md)
- 📚 [API Reference](docs/api-reference.md)
- 💻 [CLI Reference](docs/cli-reference.md)
- 🔗 [x402 Integration](docs/x402-integration.md)
- 📝 [Examples](examples/)

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [@pumpbuddy/sdk](packages/sdk) | [![npm](https://img.shields.io/npm/v/@pumpbuddy/sdk.svg)](https://www.npmjs.com/package/@pumpbuddy/sdk) | Core TypeScript SDK |
| [pumpbuddy](packages/cli) | [![npm](https://img.shields.io/npm/v/pumpbuddy.svg)](https://www.npmjs.com/package/pumpbuddy) | CLI tool |

## Development

```bash
# Clone repository
git clone https://github.com/ORG_NAME/pumpbuddy-sdk.git
cd pumpbuddy-sdk

# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test

# Lint & format
npm run lint
npm run format
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT © PumpBuddy

## Acknowledgments

- **[Coinbase x402](https://github.com/coinbase/x402)** - Payment protocol infrastructure
- **[Pump.fun](https://pump.fun)** - Creator rewards platform
- **[Solana](https://solana.com)** - Blockchain infrastructure

---

[![Built with x402](https://img.shields.io/badge/Built%20with-x402%20by%20Coinbase-00FF7F?style=for-the-badge)](https://github.com/coinbase/x402)
```

### 2. Root package.json

```json
{
  "name": "pumpbuddy-monorepo",
  "version": "0.2.0",
  "private": true,
  "description": "Distribute Pump.fun rewards via x402",
  "repository": {
    "type": "git",
    "url": "https://github.com/ORG_NAME/pumpbuddy-sdk.git"
  },
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "build": "npm run build --workspaces",
    "test": "npm test --workspaces",
    "lint": "eslint packages/*/src --ext .ts",
    "lint:fix": "eslint packages/*/src --ext .ts --fix",
    "format": "prettier --write \"packages/*/src/**/*.ts\"",
    "clean": "npm run clean --workspaces",
    "prepublishOnly": "npm run build && npm test"
  },
  "devDependencies": {
    "@types/node": "^20",
    "typescript": "^5.7.2",
    "eslint": "^9",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "prettier": "^3.4.2",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11"
  },
  "keywords": [
    "pumpbuddy",
    "pump.fun",
    "solana",
    "x402",
    "coinbase",
    "crypto",
    "rewards",
    "distribution",
    "sdk",
    "cli"
  ],
  "author": "PumpBuddy",
  "license": "MIT"
}
```

### 3. GitHub Actions - CI Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Build
        run: npm run build
      
      - name: Test
        run: npm test
```

### 4. GitHub Actions - Publish Workflow

```yaml
# .github/workflows/publish.yml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Test
        run: npm test
      
      - name: Publish SDK
        run: cd packages/sdk && npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      
      - name: Publish CLI
        run: cd packages/cli && npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 5. Package-specific READMEs

#### packages/sdk/README.md

```markdown
# @pumpbuddy/sdk

TypeScript SDK for distributing Pump.fun token rewards via Coinbase x402.

## Installation

```bash
npm install @pumpbuddy/sdk
```

## Quick Start

```typescript
import { PumpBuddy } from '@pumpbuddy/sdk';

const sdk = new PumpBuddy({ network: 'devnet' });
await sdk.init();

// Distribute rewards
await sdk.distribute({
  wallet: 'YOUR_WALLET',
  tokenMint: 'TOKEN_MINT',
  recipients: [...],
  dryRun: true
});
```

[Full documentation →](../../docs/api-reference.md)
```

#### packages/cli/README.md

```markdown
# pumpbuddy

Command-line tool for distributing Pump.fun rewards.

## Installation

```bash
npm install -g pumpbuddy
```

## Usage

```bash
# Quick start
pumpbuddy quickstart

# Distribute rewards
pumpbuddy distribute \
  --wallet YOUR_WALLET \
  --token TOKEN_MINT \
  --recipients ./recipients.csv \
  --dry-run
```

[Full documentation →](../../docs/cli-reference.md)
```

## Publishing to npm

### Prerequisites

1. **npm account** with publish access
2. **npm token** for GitHub Actions
3. **Semantic versioning** strategy

### Initial Setup

```bash
# 1. Login to npm
npm login

# 2. Set up organization (optional)
npm org add <org-name>

# 3. Test local publish
cd packages/sdk
npm pack  # Creates tarball
```

### Publishing Process

#### Manual Publish

```bash
# 1. Update version in package.json files
npm version patch  # or minor, major

# 2. Build all packages
npm run build

# 3. Run tests
npm test

# 4. Publish SDK
cd packages/sdk
npm publish --access public

# 5. Publish CLI
cd ../cli
npm publish --access public
```

#### Automated Publish (via GitHub Actions)

1. Create release on GitHub
2. Workflow automatically publishes to npm
3. Version tags packages appropriately

### Package Scoping

```json
// packages/sdk/package.json
{
  "name": "@pumpbuddy/sdk",
  "version": "0.2.0",
  "publishConfig": {
    "access": "public"
  }
}

// packages/cli/package.json
{
  "name": "pumpbuddy",
  "version": "0.2.0",
  "bin": {
    "pumpbuddy": "./dist/index.js"
  }
}
```

## Repository Setup Checklist

### Before Push

- [ ] Remove all marketing website files (`app/`, `components/`, `public/`, etc.)
- [ ] Keep only `packages/sdk/` and `packages/cli/`
- [ ] Update root `package.json` with workspaces
- [ ] Add comprehensive SDK and CLI READMEs
- [ ] Include example files
- [ ] Add tests for both packages
- [ ] Create documentation in `docs/`

### GitHub Configuration

- [ ] Create repository: `ORG_NAME/pumpbuddy-sdk`
- [ ] Add description: "Distribute Pump.fun rewards via Coinbase x402"
- [ ] Add topics: `solana`, `pump-fun`, `x402`, `sdk`, `cli`, `coinbase`
- [ ] Enable GitHub Actions
- [ ] Add npm token to secrets (`NPM_TOKEN`)
- [ ] Configure branch protection for `main`
- [ ] Enable Issues and Discussions

### Documentation

- [ ] Complete API reference
- [ ] CLI command documentation
- [ ] x402 integration guide
- [ ] Usage examples
- [ ] Contributing guidelines
- [ ] Security policy

### npm Publishing

- [ ] Verify package names available
- [ ] Set up npm organization (if using `@pumpbuddy/`)
- [ ] Test local install of packages
- [ ] Publish initial versions
- [ ] Verify packages work when installed

## Files to Remove

These marketing website files should NOT be in the SDK repository:

```
❌ app/ (entire Next.js app directory)
❌ components/ (React components)
❌ public/ (except examples)
❌ next.config.ts
❌ next-env.d.ts
❌ tailwind.config.ts
❌ postcss.config.mjs
❌ jest.config.js
❌ jest.setup.js
❌ __tests__/ (marketing site tests)
❌ prisma/
❌ vercel.json
❌ Any marketing-related docs
```

## Files to Keep

```
✅ packages/sdk/
✅ packages/cli/
✅ examples/
✅ tests/
✅ docs/
✅ .github/
✅ LICENSE
✅ README.md (SDK-focused)
✅ CONTRIBUTING.md
✅ CHANGELOG.md
✅ package.json (workspaces config)
✅ tsconfig.json
✅ .gitignore
✅ .eslintrc.json
✅ .prettierrc
```

## Example File Structure (Clean SDK Repo)

```
pumpbuddy-sdk/                    # Root
│
├── packages/                     # Monorepo packages
│   ├── sdk/                      # @pumpbuddy/sdk
│   └── cli/                      # pumpbuddy
│
├── examples/                     # Usage examples
│   ├── basic-distribution.ts
│   └── recipients.csv
│
├── tests/                        # Test suites
│   ├── sdk/
│   └── cli/
│
├── docs/                         # Documentation
│   ├── getting-started.md
│   ├── api-reference.md
│   └── x402-integration.md
│
├── .github/                      # GitHub config
│   └── workflows/
│
├── README.md                     # Main SDK README
├── package.json                  # Root (workspaces)
├── LICENSE
└── CHANGELOG.md
```

This structure is:
- ✅ Clean and focused
- ✅ npm-ready
- ✅ Professional
- ✅ Easy to contribute to
- ✅ CI/CD friendly

## Next Steps

1. **Clean up current directory** - Remove marketing files
2. **Test packages** - Ensure SDK and CLI work standalone
3. **Create GitHub repo** - Push clean SDK-only code
4. **Publish to npm** - Release initial versions
5. **Add badges** - Update README with npm/build badges

---

**Ready to ship a clean, professional SDK!** 🚀

