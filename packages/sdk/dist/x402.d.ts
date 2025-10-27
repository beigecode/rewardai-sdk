import type { CreateInvoiceParams, X402Invoice } from './types';
/**
 * Create an x402 invoice using Coinbase's protocol
 *
 * This now uses the real x402 protocol implementation.
 * See: https://github.com/coinbase/x402
 *
 * The x402 protocol flow:
 * 1. Resource server (PumpBuddy) returns 402 with payment requirements
 * 2. Client creates payment payload and sends with X-PAYMENT header
 * 3. Server verifies payment via x402 facilitator
 * 4. Server settles payment on Solana via facilitator
 * 5. Server returns resource with X-PAYMENT-RESPONSE header
 */
export declare function createInvoice(params: CreateInvoiceParams, network?: 'mainnet-beta' | 'devnet' | 'testnet'): Promise<X402Invoice>;
/**
 * Verify x402 invoice payment settlement
 *
 * Uses x402 facilitator to:
 * 1. Verify payment signature and amount
 * 2. Submit transaction to Solana
 * 3. Wait for blockchain confirmation
 * 4. Return transaction details
 */
export declare function verifySettlement(invoice: X402Invoice, paymentHeader: string, network?: 'mainnet-beta' | 'devnet' | 'testnet'): Promise<boolean>;
/**
 * Cancel an x402 invoice
 */
export declare function cancelInvoice(invoiceId: string): Promise<boolean>;
/**
 * Get invoice status
 */
export declare function getInvoiceStatus(invoiceId: string): Promise<X402Invoice['status']>;
