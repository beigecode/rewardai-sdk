/**
 * x402 Protocol Integration for RewardAI
 * 
 * Leverages Coinbase's x402 payment protocol to facilitate reward distributions
 * from Pump.fun creator wallets to token holders.
 * 
 * @see https://github.com/coinbase/x402
 */

import axios from 'axios';
import type {
  CreateInvoiceParams,
  X402Invoice,
} from './types';

/**
 * x402 Payment Requirements (from x402 spec)
 */
export interface X402PaymentRequirements {
  scheme: string;
  network: string;
  maxAmountRequired: string;
  resource: string;
  description: string;
  mimeType: string;
  outputSchema?: object | null;
  payTo: string;
  maxTimeoutSeconds: number;
  asset: string;
  extra: object | null;
}

/**
 * x402 Payment Payload (included as X-PAYMENT header)
 */
export interface X402PaymentPayload {
  x402Version: number;
  scheme: string;
  network: string;
  payload: any;
}

/**
 * x402 Facilitator Response for verification
 */
export interface X402VerificationResponse {
  isValid: boolean;
  invalidReason: string | null;
}

/**
 * x402 Facilitator Response for settlement
 */
export interface X402SettlementResponse {
  success: boolean;
  error: string | null;
  txHash: string | null;
  networkId: string | null;
}

/**
 * x402 Client for RewardAI SDK
 * 
 * This client wraps the x402 protocol to:
 * 1. Create payment requirements for reward distributions
 * 2. Verify payments from creator wallets
 * 3. Settle distributions on Solana blockchain
 */
export class X402Client {
  private facilitatorUrl: string;
  private network: 'mainnet-beta' | 'devnet' | 'testnet';

  constructor(
    facilitatorUrl: string = 'https://x402-facilitator.coinbase.com',
    network: 'mainnet-beta' | 'devnet' | 'testnet' = 'devnet'
  ) {
    this.facilitatorUrl = facilitatorUrl;
    this.network = network;
  }

  /**
   * Create x402 payment requirements for a reward distribution
   * 
   * This generates the 402 Payment Required response that tells
   * the creator how to fund their distribution vault.
   */
  async createPaymentRequirements(
    params: CreateInvoiceParams
  ): Promise<X402PaymentRequirements> {
    const { tokenMint, amount, recipient, description } = params;

    // Map Solana network to x402 network format
    const networkId = this.getNetworkId();

    return {
      scheme: 'exact', // Using x402 'exact' scheme for fixed-amount transfers
      network: networkId,
      maxAmountRequired: amount.toString(),
      resource: `/distribute/${tokenMint}`,
      description: description || 'Fund RewardAI distribution vault',
      mimeType: 'application/json',
      outputSchema: {
        type: 'object',
        properties: {
          txHash: { type: 'string' },
          distributed: { type: 'number' },
          recipients: { type: 'number' },
        },
      },
      payTo: recipient,
      maxTimeoutSeconds: 300, // 5 minutes
      asset: tokenMint,
      extra: {
        blockchain: 'solana',
        tokenType: 'spl',
        pumpfunToken: true,
      },
    };
  }

  /**
   * Verify x402 payment payload with facilitator
   * 
   * The facilitator verifies that:
   * - Payment signature is valid
   * - Amount matches requirements
   * - Payment hasn't been used before
   */
  async verifyPayment(
    paymentHeader: string,
    requirements: X402PaymentRequirements
  ): Promise<X402VerificationResponse> {
    try {
      const response = await axios.post(
        `${this.facilitatorUrl}/verify`,
        {
          x402Version: 1,
          paymentHeader,
          paymentRequirements: requirements,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return {
        isValid: false,
        invalidReason: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Settle x402 payment via facilitator
   * 
   * The facilitator:
   * 1. Submits the payment to Solana blockchain
   * 2. Waits for confirmation
   * 3. Returns transaction details
   */
  async settlePayment(
    paymentHeader: string,
    requirements: X402PaymentRequirements
  ): Promise<X402SettlementResponse> {
    try {
      const response = await axios.post(
        `${this.facilitatorUrl}/settle`,
        {
          x402Version: 1,
          paymentHeader,
          paymentRequirements: requirements,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Payment settlement failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        txHash: null,
        networkId: null,
      };
    }
  }

  /**
   * Get supported schemes and networks from facilitator
   */
  async getSupportedSchemes(): Promise<
    Array<{ scheme: string; network: string }>
  > {
    try {
      const response = await axios.get(`${this.facilitatorUrl}/supported`);
      return response.data.kinds || [];
    } catch (error) {
      console.error('Failed to get supported schemes:', error);
      return [];
    }
  }

  /**
   * Create x402 payment payload (what goes in X-PAYMENT header)
   */
  createPaymentPayload(
    scheme: string,
    network: string,
    payload: any
  ): X402PaymentPayload {
    return {
      x402Version: 1,
      scheme,
      network,
      payload,
    };
  }

  /**
   * Encode payment payload to base64 for X-PAYMENT header
   */
  encodePaymentHeader(payload: X402PaymentPayload): string {
    const json = JSON.stringify(payload);
    return Buffer.from(json).toString('base64');
  }

  /**
   * Decode X-PAYMENT header from base64
   */
  decodePaymentHeader(header: string): X402PaymentPayload {
    const json = Buffer.from(header, 'base64').toString('utf-8');
    return JSON.parse(json);
  }

  /**
   * Map Solana network to x402 network format
   */
  private getNetworkId(): string {
    switch (this.network) {
      case 'mainnet-beta':
        return 'solana-mainnet';
      case 'devnet':
        return 'solana-devnet';
      case 'testnet':
        return 'solana-testnet';
      default:
        return 'solana-devnet';
    }
  }
}

/**
 * Create x402 invoice using Coinbase's protocol
 * 
 * This replaces the stub implementation with actual x402 integration.
 * The invoice flow follows the x402 spec:
 * 1. Resource server returns 402 Payment Required with payment requirements
 * 2. Client creates payment payload and sends with X-PAYMENT header
 * 3. Server verifies payment via facilitator
 * 4. Server settles payment via facilitator
 * 5. Server returns resource with X-PAYMENT-RESPONSE header
 */
export async function createX402Invoice(
  params: CreateInvoiceParams,
  network: 'mainnet-beta' | 'devnet' | 'testnet' = 'devnet'
): Promise<X402Invoice> {
  const client = new X402Client(undefined, network);
  const requirements = await client.createPaymentRequirements(params);

  // Create x402 invoice object
  const invoice: X402Invoice = {
    id: `x402_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    tokenMint: params.tokenMint,
    amount: params.amount,
    recipient: params.recipient,
    status: 'pending',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(
      Date.now() + requirements.maxTimeoutSeconds * 1000
    ).toISOString(),
    // In production, this would be your resource server's URL
    paymentUrl: `https://pumpbuddy.dev/pay/${requirements.resource}`,
  };

  console.log('\n🧾 x402 Invoice Created:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Invoice ID:     ${invoice.id}`);
  console.log(`Token:          ${params.tokenMint}`);
  console.log(`Amount:         ${params.amount}`);
  console.log(`Recipient:      ${params.recipient}`);
  console.log(`Network:        ${network}`);
  console.log(`Status:         ${invoice.status}`);
  console.log(`Payment URL:    ${invoice.paymentUrl}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('📋 x402 Payment Requirements:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Scheme:         ${requirements.scheme}`);
  console.log(`Network:        ${requirements.network}`);
  console.log(`Pay To:         ${requirements.payTo}`);
  console.log(`Asset:          ${requirements.asset}`);
  console.log(`Max Amount:     ${requirements.maxAmountRequired}`);
  console.log(`Timeout:        ${requirements.maxTimeoutSeconds}s`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('📝 Next steps:');
  console.log('1. Fund your creator wallet with the required tokens');
  console.log('2. Sign the payment with your Solana wallet');
  console.log('3. Submit payment with X-PAYMENT header');
  console.log('4. x402 facilitator will verify and settle on-chain\n');

  return invoice;
}

/**
 * Verify x402 invoice settlement
 */
export async function verifyX402Settlement(
  invoice: X402Invoice,
  paymentHeader: string,
  network: 'mainnet-beta' | 'devnet' | 'testnet' = 'devnet'
): Promise<boolean> {
  const client = new X402Client(undefined, network);

  // Create requirements from invoice
  const requirements = await client.createPaymentRequirements({
    tokenMint: invoice.tokenMint,
    amount: invoice.amount,
    recipient: invoice.recipient,
  });

  // Verify payment
  const verification = await client.verifyPayment(paymentHeader, requirements);

  if (!verification.isValid) {
    console.error(
      `\n✗ Payment verification failed: ${verification.invalidReason}\n`
    );
    return false;
  }

  console.log('\n✓ Payment verified by x402 facilitator');

  // Settle payment
  const settlement = await client.settlePayment(paymentHeader, requirements);

  if (!settlement.success) {
    console.error(`\n✗ Payment settlement failed: ${settlement.error}\n`);
    return false;
  }

  console.log('✓ Payment settled on Solana');
  console.log(`Transaction: ${settlement.txHash}`);
  console.log(`Network: ${settlement.networkId}\n`);

  return true;
}

