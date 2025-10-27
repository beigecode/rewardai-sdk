# RewardAI SDK

[![npm version](https://badge.fury.io/js/%40beigecode%2Frewardai-sdk.svg)](https://www.npmjs.com/package/@beigecode/rewardai-sdk)
[![Build Status](https://github.com/beigecode/rewardai-sdk/workflows/CI/badge.svg)](https://github.com/beigecode/rewardai-sdk/actions)
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
npm install @beigecode/rewardai-sdk

# Install CLI globally
npm install -g @beigecode/rewardai
```

### SDK Usage

```typescript
import { RewardAI } from '@rewardai/sdk';

const sdk = new RewardAI({ network: 'devnet' });
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
  dryRun: true
});
```

### CLI Usage

```bash
# Interactive quickstart
rewardai quickstart --wallet YOUR_WALLET

# Distribute rewards (dry-run)
rewardai distribute \
  --wallet YOUR_WALLET \
  --token TOKEN_MINT \
  --recipients ./recipients.csv \
  --dry-run
```

## x402 Payment Protocol

RewardAI leverages [Coinbase's x402](https://github.com/coinbase/x402) for secure HTTP-based blockchain payments.

[Read the x402 Integration Guide →](docs/x402-integration.md)

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [@rewardai/sdk](packages/sdk) | [![npm](https://img.shields.io/npm/v/@rewardai/sdk.svg)](https://www.npmjs.com/package/@rewardai/sdk) | Core TypeScript SDK |
| [rewardai](packages/cli) | [![npm](https://img.shields.io/npm/v/rewardai.svg)](https://www.npmjs.com/package/rewardai) | CLI tool |

## Development

```bash
# Clone repository
git clone https://github.com/beigecode/rewardai-sdk.git
cd rewardai-sdk

# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test
```

## Documentation

- 📖 Getting Started - See package READMEs
- 📚 [API Reference](packages/sdk/README.md)
- 💻 [CLI Reference](packages/cli/README.md)
- 🔗 [x402 Integration](docs/x402-integration.md)

## Contributing

We welcome contributions! Please open an issue or PR.

## License

MIT © RewardAI

## Acknowledgments

- **[Coinbase x402](https://github.com/coinbase/x402)** - Payment protocol infrastructure
- **[Pump.fun](https://pump.fun)** - Creator rewards platform
- **[Solana](https://solana.com)** - Blockchain infrastructure

---

[![Built with x402](https://img.shields.io/badge/Built%20with-x402%20by%20Coinbase-00FF7F?style=for-the-badge)](https://github.com/coinbase/x402)
