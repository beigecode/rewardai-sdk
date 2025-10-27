import type {
  CreateInvoiceParams,
  X402Invoice,
} from './types.js';
import { createX402Invoice, verifyX402Settlement } from './x402-integration.js';

/**
 * Create an x402 invoice using Coinbase's protocol
 * 
 * This now uses the real x402 protocol implementation.
 * See: https://github.com/coinbase/x402
 * 
 * The x402 protocol flow:
 * 1. Resource server (RewardAI) returns 402 with payment requirements
 * 2. Client creates payment payload and sends with X-PAYMENT header
 * 3. Server verifies payment via x402 facilitator
 * 4. Server settles payment on Solana via facilitator
 * 5. Server returns resource with X-PAYMENT-RESPONSE header
 */
export async function createInvoice(
  params: CreateInvoiceParams,
  network: 'mainnet-beta' | 'devnet' | 'testnet' = 'devnet'
): Promise<X402Invoice> {
  return createX402Invoice(params, network);
}

/**
 * Verify x402 invoice payment settlement
 * 
 * Uses x402 facilitator to:
 * 1. Verify payment signature and amount
 * 2. Submit transaction to Solana
 * 3. Wait for blockchain confirmation
 * 4. Return transaction details
 */
export async function verifySettlement(
  invoice: X402Invoice,
  paymentHeader: string,
  network: 'mainnet-beta' | 'devnet' | 'testnet' = 'devnet'
): Promise<boolean> {
  return verifyX402Settlement(invoice, paymentHeader, network);
}

/**
 * Cancel an x402 invoice
 */
export async function cancelInvoice(invoiceId: string): Promise<boolean> {
  console.log(`\n✗ Canceling invoice ${invoiceId}...`);
  console.log('✓ Invoice canceled (MOCK)\n');
  
  return true;
}

/**
 * Get invoice status
 */
export async function getInvoiceStatus(
  invoiceId: string
): Promise<X402Invoice['status']> {
  console.log(`\n📊 Fetching status for invoice ${invoiceId}...`);
  
  // Mock: return pending status
  return 'pending';
}

