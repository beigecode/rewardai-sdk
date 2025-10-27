# RewardAI SDK - Usage Examples

## Quick Start

### 1. Installation

```bash
npm install rewardai-sdk
```

### 2. Basic Setup (Dry-Run)

```typescript
import { RewardAI } from 'rewardai-sdk';

const sdk = new RewardAI({
  network: 'mainnet-beta', // or 'devnet' for testing
  verbose: true
});

await sdk.init();

// Dry-run (no actual transfers)
const result = await sdk.distribute({
  wallet: 'YOUR_WALLET_ADDRESS',
  tokenMint: 'YOUR_TOKEN_MINT',
  recipients: [
    { wallet: 'RECIPIENT_1', amount: 100 },
    { wallet: 'RECIPIENT_2', amount: 200 }
  ],
  dryRun: true
});

console.log(result);
```

## Real Transfers

To execute real token transfers, you need to provide a keypair for signing transactions.

### Option 1: From Private Key (Base58)

```typescript
import { RewardAI } from 'rewardai-sdk';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

// Load your private key (KEEP THIS SECURE!)
const privateKeyBase58 = 'YOUR_PRIVATE_KEY_IN_BASE58';
const secretKey = bs58.decode(privateKeyBase58);
const keypair = Keypair.fromSecretKey(secretKey);

// Initialize SDK with keypair
const sdk = new RewardAI({
  network: 'mainnet-beta',
  keypair: keypair,
  verbose: true
});

await sdk.init();

// Execute real transfers
const result = await sdk.distribute({
  wallet: keypair.publicKey.toString(),
  tokenMint: 'YOUR_PUMP_FUN_TOKEN_MINT',
  recipients: [
    { wallet: 'RECIPIENT_1', amount: 1000, name: 'Alice' },
    { wallet: 'RECIPIENT_2', amount: 500, name: 'Bob' }
  ],
  dryRun: false // Real transfer!
});

console.log(`✅ ${result.distributedCount}/${result.totalRecipients} transfers successful`);
console.log('Transaction signatures:', result.signatures);
```

### Option 2: From JSON Keypair File

```typescript
import { RewardAI } from 'rewardai-sdk';
import { Keypair } from '@solana/web3.js';
import fs from 'fs';

// Load keypair from file (e.g., from Solana CLI)
const keypairFile = fs.readFileSync('/path/to/keypair.json', 'utf-8');
const secretKey = Uint8Array.from(JSON.parse(keypairFile));
const keypair = Keypair.fromSecretKey(secretKey);

const sdk = new RewardAI({
  network: 'mainnet-beta',
  keypair: keypair
});

await sdk.init();

const result = await sdk.distribute({
  wallet: keypair.publicKey.toString(),
  tokenMint: 'YOUR_TOKEN_MINT',
  recipients: [
    { wallet: 'RECIPIENT_ADDRESS', amount: 1000 }
  ],
  dryRun: false
});
```

### Option 3: From Environment Variable

```typescript
import { RewardAI } from 'rewardai-sdk';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

// Load from environment variable
const privateKey = process.env.SOLANA_PRIVATE_KEY;
if (!privateKey) {
  throw new Error('SOLANA_PRIVATE_KEY not set');
}

const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));

const sdk = new RewardAI({
  network: process.env.SOLANA_NETWORK || 'mainnet-beta',
  keypair: keypair
});

await sdk.init();
```

## CSV Batch Rewards

```typescript
import { RewardAI } from 'rewardai-sdk';
import { Keypair } from '@solana/web3.js';
import fs from 'fs';
import bs58 from 'bs58';

// Load recipients from CSV
const csvData = fs.readFileSync('recipients.csv', 'utf-8');
const lines = csvData.split('\n').slice(1); // Skip header

const recipients = lines
  .filter(line => line.trim())
  .map(line => {
    const [wallet, amount, name] = line.split(',');
    return {
      wallet: wallet.trim(),
      amount: parseFloat(amount.trim()),
      name: name?.trim()
    };
  });

// Load keypair
const keypair = Keypair.fromSecretKey(
  bs58.decode(process.env.SOLANA_PRIVATE_KEY!)
);

// Initialize and distribute
const sdk = new RewardAI({
  network: 'mainnet-beta',
  keypair: keypair,
  verbose: true
});

await sdk.init();

const result = await sdk.distribute({
  wallet: keypair.publicKey.toString(),
  tokenMint: 'YOUR_TOKEN_MINT',
  recipients: recipients,
  dryRun: false
});

console.log(`\n📊 Results:`);
console.log(`✅ Successful: ${result.distributedCount}`);
console.log(`❌ Failed: ${result.failedCount}`);
if (result.errors) {
  console.log('\nErrors:', result.errors);
}
```

## Error Handling

```typescript
const sdk = new RewardAI({
  network: 'mainnet-beta',
  keypair: keypair
});

try {
  await sdk.init();
  
  const result = await sdk.distribute({
    wallet: keypair.publicKey.toString(),
    tokenMint: 'YOUR_TOKEN_MINT',
    recipients: recipients,
    dryRun: false
  });

  if (result.failedCount > 0) {
    console.error('Some transfers failed:');
    result.errors?.forEach(err => console.error('  -', err));
  }

  // Log successful transactions
  result.signatures?.forEach((sig, i) => {
    console.log(`✅ Transaction ${i + 1}: https://solscan.io/tx/${sig}`);
  });

} catch (error) {
  console.error('Distribution failed:', error.message);
}
```

## Security Best Practices

⚠️ **NEVER** commit private keys to version control!

### Recommended Approaches:

1. **Environment Variables**
   ```bash
   export SOLANA_PRIVATE_KEY="your_base58_key"
   ```

2. **Secure Key Storage**
   - Use hardware wallets for production
   - Use encrypted key stores
   - Use multi-sig for large amounts

3. **Separate Wallets**
   - Use a dedicated "rewards wallet"
   - Keep only the amount needed for distributions
   - Don't reuse personal wallet keys

4. **Testing**
   - Always test with `dryRun: true` first
   - Test on devnet before mainnet
   - Start with small amounts

## Complete Example

```typescript
import { RewardAI } from 'rewardai-sdk';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

async function distributeRewards() {
  // 1. Setup keypair (SECURE THIS!)
  const keypair = Keypair.fromSecretKey(
    bs58.decode(process.env.SOLANA_PRIVATE_KEY!)
  );

  // 2. Initialize SDK
  const sdk = new RewardAI({
    network: 'mainnet-beta',
    keypair: keypair,
    verbose: true
  });

  await sdk.init();

  // 3. Check balance first
  const balance = await sdk.getBalance(keypair.publicKey.toString());
  console.log(`Wallet balance: ${balance} SOL`);

  // 4. Define recipients
  const recipients = [
    { wallet: 'RECIPIENT_1_ADDRESS', amount: 1000, name: 'Top Trader' },
    { wallet: 'RECIPIENT_2_ADDRESS', amount: 500, name: 'Active Member' },
    { wallet: 'RECIPIENT_3_ADDRESS', amount: 250, name: 'New User' }
  ];

  // 5. Dry-run first
  console.log('\n🧪 Testing with dry-run...\n');
  const dryRunResult = await sdk.distribute({
    wallet: keypair.publicKey.toString(),
    tokenMint: 'YOUR_PUMP_FUN_TOKEN_MINT',
    recipients: recipients,
    dryRun: true
  });
  console.log('Dry-run successful:', dryRunResult);

  // 6. Execute real transfer
  console.log('\n🚀 Executing real transfers...\n');
  const result = await sdk.distribute({
    wallet: keypair.publicKey.toString(),
    tokenMint: 'YOUR_PUMP_FUN_TOKEN_MINT',
    recipients: recipients,
    dryRun: false
  });

  // 7. Report results
  console.log('\n📊 Distribution Complete!\n');
  console.log(`✅ Successful: ${result.distributedCount}/${result.totalRecipients}`);
  console.log(`❌ Failed: ${result.failedCount}`);
  
  if (result.signatures && result.signatures.length > 0) {
    console.log('\n🔗 Transactions:');
    result.signatures.forEach((sig, i) => {
      console.log(`  ${i + 1}. https://solscan.io/tx/${sig}`);
    });
  }

  if (result.errors && result.errors.length > 0) {
    console.log('\n⚠️  Errors:');
    result.errors.forEach(err => console.log(`  - ${err}`));
  }
}

// Run
distributeRewards().catch(console.error);
```

## Need Help?

- 📖 [Documentation](https://github.com/beigecode/rewardai-sdk)
- 🐛 [Report Issues](https://github.com/beigecode/rewardai-sdk/issues)
- 💬 [Discussions](https://github.com/beigecode/rewardai-sdk/discussions)

