# RewardAI x402 Integration Guide

## Overview

RewardAI leverages [Coinbase's x402 protocol](https://github.com/coinbase/x402) to facilitate secure, HTTP-based payments for distributing Pump.fun creator rewards to token holders on Solana.

## What is x402?

x402 is **a payments protocol for the internet, built on HTTP**. It provides:

- ✅ **Standard HTTP headers** for payment communication
- ✅ **Flexible payment schemes** (exact amounts, up-to amounts, streaming, etc.)
- ✅ **Multi-blockchain support** (Ethereum, Solana, Base, etc.)
- ✅ **Facilitator pattern** for easy integration without running blockchain nodes
- ✅ **Payment verification & settlement** handled by third-party facilitators

### Why x402 for RewardAI?

1. **No Wallet Infrastructure**: Creators don't need to manage private keys or run nodes
2. **HTTP-Based**: Works with standard web servers and APIs
3. **Secure**: Cryptographic verification of all payments
4. **Flexible**: Supports multiple payment schemes and chains
5. **Production-Ready**: Built and maintained by Coinbase

## x402 Protocol Flow in RewardAI

### Step 1: Resource Server Returns Payment Requirements

When a creator wants to distribute rewards, RewardAI acts as a **resource server** and returns a `402 Payment Required` response:

```typescript
// RewardAI creates payment requirements
const requirements = {
  scheme: 'exact',              // Fixed-amount payment
  network: 'solana-devnet',     // Solana devnet (or mainnet)
  maxAmountRequired: '1000',    // Amount in token base units
  resource: '/distribute/TOKEN_MINT',
  description: 'Fund distribution vault for 50 recipients',
  payTo: 'VAULT_ADDRESS',       // RewardAI vault address
  asset: 'TOKEN_MINT_ADDRESS',  // SPL token address
  maxTimeoutSeconds: 300,       // 5 minutes
  extra: {
    blockchain: 'solana',
    tokenType: 'spl',
    pumpfunToken: true
  }
};
```

### Step 2: Creator Signs Payment

The creator's wallet signs a payment payload:

```typescript
// Creator creates payment payload
const paymentPayload = {
  x402Version: 1,
  scheme: 'exact',
  network: 'solana-devnet',
  payload: {
    from: 'CREATOR_WALLET',
    to: 'VAULT_ADDRESS',
    amount: '1000',
    token: 'TOKEN_MINT',
    signature: '...',  // Solana signature
    blockhash: '...'   // Recent blockhash
  }
};

// Encode as base64 for X-PAYMENT header
const xPaymentHeader = btoa(JSON.stringify(paymentPayload));
```

### Step 3: RewardAI Verifies Payment

RewardAI sends the payment to an **x402 facilitator** for verification:

```typescript
POST https://x402-facilitator.coinbase.com/verify
Content-Type: application/json

{
  "x402Version": 1,
  "paymentHeader": "base64EncodedPayload",
  "paymentRequirements": { ...requirements }
}

// Response
{
  "isValid": true,
  "invalidReason": null
}
```

### Step 4: Facilitator Settles Payment

If valid, RewardAI requests settlement:

```typescript
POST https://x402-facilitator.coinbase.com/settle
Content-Type: application/json

{
  "x402Version": 1,
  "paymentHeader": "base64EncodedPayload",
  "paymentRequirements": { ...requirements }
}

// Response
{
  "success": true,
  "error": null,
  "txHash": "5k7...",  // Solana transaction hash
  "networkId": "solana-devnet"
}
```

### Step 5: RewardAI Distributes Rewards

With payment confirmed, RewardAI executes the distribution and returns:

```typescript
HTTP/1.1 200 OK
X-PAYMENT-RESPONSE: base64EncodedSettlementResponse
Content-Type: application/json

{
  "distributed": 50,
  "totalAmount": 1000,
  "txHashes": ["..."],
  "vaultTxHash": "5k7..."  // From x402 settlement
}
```

## RewardAI SDK Implementation

### Creating an Invoice

```typescript
import { RewardAI } from '@rewardai/sdk';

const sdk = new RewardAI({ network: 'devnet' });
await sdk.init();

// Create x402 invoice for funding distribution
const invoice = await sdk.fundViaX402({
  amount: 1000,
  tokenMint: 'PUMP_TOKEN_MINT',
  toVault: 'PUMPBUDDY_VAULT_ADDRESS',
  description: 'Fund distribution for 50 holders'
});

console.log('Payment URL:', invoice.paymentUrl);
console.log('Invoice ID:', invoice.id);
```

### Verifying Settlement

```typescript
// After creator pays, verify settlement
const verified = await sdk.verifyInvoice(invoice);

if (verified) {
  // Proceed with distribution
  await sdk.distribute({
    wallet: 'VAULT_ADDRESS',
    tokenMint: 'PUMP_TOKEN_MINT',
    recipients: [...],
    dryRun: false
  });
}
```

## x402 Client API

RewardAI provides a low-level x402 client:

```typescript
import { X402Client } from '@rewardai/sdk';

const client = new X402Client(
  'https://x402-facilitator.coinbase.com',
  'devnet'
);

// Create payment requirements
const requirements = await client.createPaymentRequirements({
  tokenMint: 'TOKEN_MINT',
  amount: 1000,
  recipient: 'VAULT_ADDRESS'
});

// Verify payment
const verification = await client.verifyPayment(
  xPaymentHeader,
  requirements
);

// Settle payment
const settlement = await client.settlePayment(
  xPaymentHeader,
  requirements
);
```

## x402 Payment Schemes

### Current: `exact` Scheme

Fixed-amount payments (what RewardAI uses):

```typescript
{
  scheme: 'exact',
  maxAmountRequired: '1000',  // Exact amount to pay
  ...
}
```

### Future Schemes

x402 supports extensible schemes:

- **`upto`**: Pay up to an amount (for variable usage)
- **`streaming`**: Continuous micro-payments over time
- **`conditional`**: Payments based on conditions

RewardAI can evolve to support these as needed.

## Facilitator Endpoints

### GET /supported

Query supported schemes and networks:

```bash
curl https://x402-facilitator.coinbase.com/supported
```

Response:
```json
{
  "kinds": [
    { "scheme": "exact", "network": "solana-mainnet" },
    { "scheme": "exact", "network": "solana-devnet" },
    { "scheme": "upto", "network": "ethereum-mainnet" }
  ]
}
```

### POST /verify

Verify payment is valid:

```bash
curl -X POST https://x402-facilitator.coinbase.com/verify \
  -H "Content-Type: application/json" \
  -d '{
    "x402Version": 1,
    "paymentHeader": "...",
    "paymentRequirements": {...}
  }'
```

### POST /settle

Settle payment on blockchain:

```bash
curl -X POST https://x402-facilitator.coinbase.com/settle \
  -H "Content-Type: application/json" \
  -d '{
    "x402Version": 1,
    "paymentHeader": "...",
    "paymentRequirements": {...}
  }'
```

## Security Considerations

### Payment Verification

1. **Signature Verification**: All payments must have valid Solana signatures
2. **Amount Verification**: Payment amount must match requirements
3. **Replay Protection**: Each payment can only be used once
4. **Timeout Enforcement**: Payments expire after `maxTimeoutSeconds`

### Private Key Management

- ✅ **Creators**: Sign payments with their Pump.fun wallet (never shared)
- ✅ **RewardAI**: Only holds distribution vault keys (isolated per distribution)
- ✅ **Facilitator**: Never has access to private keys

### On-Chain Verification

The x402 facilitator:
- Verifies payment signature against Solana blockchain
- Checks account balances and token ownership
- Submits transactions and waits for confirmation
- Returns blockchain transaction hashes

## Configuration

### Environment Variables

```bash
# .env
X402_FACILITATOR_URL=https://x402-facilitator.coinbase.com
SOLANA_NETWORK=devnet
PUMPBUDDY_VAULT_ADDRESS=YourVaultAddress...
```

### SDK Configuration

```typescript
const sdk = new RewardAI({
  network: 'devnet',
  x402FacilitatorUrl: process.env.X402_FACILITATOR_URL,
  vaultAddress: process.env.PUMPBUDDY_VAULT_ADDRESS
});
```

## Testing

### Local Development

Use x402 devnet facilitator:

```typescript
const sdk = new RewardAI({
  network: 'devnet',
  x402FacilitatorUrl: 'https://devnet.x402-facilitator.coinbase.com'
});
```

### Integration Tests

```bash
# Test payment verification
npm run test:x402:verify

# Test payment settlement
npm run test:x402:settle

# Test full flow
npm run test:x402:e2e
```

## Migration from Stub Implementation

The SDK now uses real x402 integration:

### Before (Stub):
```typescript
// Mock invoice
const invoice = {
  id: 'mock_123',
  paymentUrl: 'https://mock.com/pay'
};
```

### After (Real x402):
```typescript
// Real x402 invoice
const invoice = await createX402Invoice({
  tokenMint: 'TOKEN_MINT',
  amount: 1000,
  recipient: 'VAULT_ADDRESS'
});
// Returns real payment requirements and facilitator URLs
```

## Resources

- **x402 Specification**: https://github.com/coinbase/x402
- **x402 TypeScript SDK**: https://github.com/coinbase/x402/tree/main/typescript
- **x402 Examples**: https://github.com/coinbase/x402/tree/main/examples
- **Solana SPL Tokens**: https://spl.solana.com/token
- **RewardAI Docs**: [/packages/sdk/README.md](/packages/sdk/README.md)

## Support

For x402-specific questions:
- GitHub Issues: https://github.com/coinbase/x402/issues
- x402 Docs: https://x402.org

For RewardAI questions:
- GitHub Issues: https://github.com/beigecode/rewardai-sdk/issues
- Discord: https://discord.gg/rewardai

---

**Built with x402 by Coinbase** | [Learn more about x402](https://github.com/coinbase/x402)

