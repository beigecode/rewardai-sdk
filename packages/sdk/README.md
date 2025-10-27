# @pumpbuddy/sdk

TypeScript SDK for distributing Pump.fun token rewards using Coinbase x402.

## Installation

```bash
npm install @pumpbuddy/sdk
```

## Quick Start

```typescript
import { PumpBuddy } from '@pumpbuddy/sdk';

// Initialize
const sdk = new PumpBuddy({
  network: 'devnet',
  verbose: true,
});

await sdk.init();

// Distribute tokens (dry-run)
const result = await sdk.distribute({
  wallet: 'YourWalletAddress...',
  tokenMint: 'TokenMintAddress...',
  recipients: [
    { wallet: 'Recipient1...', amount: 10, name: 'Alice' },
    { wallet: 'Recipient2...', amount: 25, name: 'Bob' },
  ],
  dryRun: true, // Safe preview mode
});

console.log(result);
```

## API Reference

### `PumpBuddy`

Main SDK class.

#### `constructor(config?: PumpBuddyConfig)`

Create a new PumpBuddy instance.

**Parameters:**
- `config.network` - Solana network ('mainnet-beta', 'devnet', 'testnet')
- `config.rpcEndpoint` - Custom RPC endpoint (optional)
- `config.verbose` - Enable logging (default: false)

#### `async init(): Promise<void>`

Initialize the SDK and verify Solana connection.

#### `async distribute(params: DistributeParams): Promise<DistributeResult>`

Distribute tokens to recipients.

**Parameters:**
- `wallet` - Source wallet address
- `tokenMint` - Token mint address
- `recipients` - Array of recipients
- `dryRun` - Preview mode (default: true)

#### `async fundViaX402(params: FundViaX402Params): Promise<X402Invoice>`

Fund a vault via Coinbase x402.

**Parameters:**
- `amount` - Amount to fund
- `tokenMint` - Token mint address
- `toVault` - Vault/recipient address
- `description` - Optional description

## Development Status

⚠️ **Note:** This SDK contains stub implementations for x402 and on-chain operations. Real implementations will be added in future releases.

## License

MIT
