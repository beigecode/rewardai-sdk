# @rewardai/sdk

TypeScript SDK for distributing Pump.fun token rewards using Coinbase x402.

## Installation

```bash
npm install @rewardai/sdk
```

## Quick Start

```typescript
import { RewardAI } from '@rewardai/sdk';

// Initialize
const sdk = new RewardAI({
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

### `RewardAI`

Main SDK class.

#### `constructor(config?: RewardAIConfig)`

Create a new RewardAI instance.

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

## Helper Functions

User-friendly one-liners for common use cases:

### `rewardTopTraders`

Reward top traders from a competition:

```typescript
import { rewardTopTraders } from '@beigecode/rewardai-sdk';

await rewardTopTraders({
  wallet: 'YOUR_CREATOR_WALLET',
  tokenMint: 'YOUR_TOKEN_MINT',
  prizes: [1000, 750, 500, 250, 100],
  traders: [
    { address: 'trader1...', username: 'Alice' },
    { address: 'trader2...', username: 'Bob' },
  ],
});
```

### `airdropToHolders`

Distribute tokens proportionally to all holders:

```typescript
import { airdropToHolders } from '@beigecode/rewardai-sdk';

await airdropToHolders({
  wallet: 'YOUR_CREATOR_WALLET',
  tokenMint: 'YOUR_TOKEN_MINT',
  totalAmount: 1_000_000,
  proportional: true,
  holders: [
    { address: 'holder1...', balance: 5000 },
    { address: 'holder2...', balance: 3000 },
  ],
});
```

### `flashGiveaway`

Run instant flash giveaways:

```typescript
import { flashGiveaway } from '@beigecode/rewardai-sdk';

await flashGiveaway({
  wallet: 'YOUR_CREATOR_WALLET',
  tokenMint: 'YOUR_TOKEN_MINT',
  amount: 100,
  winners: ['winner1...', 'winner2...', 'winner3...'],
});
```

### `rewardMilestone`

Celebrate milestones with rewards:

```typescript
import { rewardMilestone } from '@beigecode/rewardai-sdk';

await rewardMilestone({
  wallet: 'YOUR_CREATOR_WALLET',
  tokenMint: 'YOUR_TOKEN_MINT',
  amount: 500,
  recipients: ['holder1...', 'holder2...'],
  message: '10K Holders Celebration! 🎉',
});
```

### `distributeStakingRewards`

Automated staking rewards:

```typescript
import { distributeStakingRewards } from '@beigecode/rewardai-sdk';

await distributeStakingRewards({
  wallet: 'YOUR_STAKING_VAULT',
  tokenMint: 'YOUR_TOKEN_MINT',
  apyRate: 0.05, // 5% APY
  period: 'weekly',
  stakers: [
    { address: 'staker1...', stakedBalance: 10000 },
    { address: 'staker2...', stakedBalance: 5000 },
  ],
});
```

### `rewardEngagement`

Reward community engagement:

```typescript
import { rewardEngagement } from '@beigecode/rewardai-sdk';

await rewardEngagement({
  wallet: 'YOUR_CREATOR_WALLET',
  tokenMint: 'YOUR_TOKEN_MINT',
  multiplier: 10,
  contributors: [
    { wallet: 'user1...', engagementScore: 150, username: 'Alice' },
    { wallet: 'user2...', engagementScore: 120, username: 'Bob' },
  ],
});
```

## Development Status

⚠️ **Note:** This SDK contains stub implementations for x402 and on-chain operations. Real implementations will be added in future releases.

## License

MIT
