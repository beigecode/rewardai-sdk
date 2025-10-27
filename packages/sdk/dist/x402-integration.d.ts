/**
 * x402 Protocol Integration for RewardAI
 *
 * Leverages Coinbase's x402 payment protocol to facilitate reward distributions
 * from Pump.fun creator wallets to token holders.
 *
 * @see https://github.com/coinbase/x402
 */
import type { CreateInvoiceParams, X402Invoice } from './types';
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
export declare class X402Client {
    private facilitatorUrl;
    private network;
    constructor(facilitatorUrl?: string, network?: 'mainnet-beta' | 'devnet' | 'testnet');
    /**
     * Create x402 payment requirements for a reward distribution
     *
     * This generates the 402 Payment Required response that tells
     * the creator how to fund their distribution vault.
     */
    createPaymentRequirements(params: CreateInvoiceParams): Promise<X402PaymentRequirements>;
    /**
     * Verify x402 payment payload with facilitator
     *
     * The facilitator verifies that:
     * - Payment signature is valid
     * - Amount matches requirements
     * - Payment hasn't been used before
     */
    verifyPayment(paymentHeader: string, requirements: X402PaymentRequirements): Promise<X402VerificationResponse>;
    /**
     * Settle x402 payment via facilitator
     *
     * The facilitator:
     * 1. Submits the payment to Solana blockchain
     * 2. Waits for confirmation
     * 3. Returns transaction details
     */
    settlePayment(paymentHeader: string, requirements: X402PaymentRequirements): Promise<X402SettlementResponse>;
    /**
     * Get supported schemes and networks from facilitator
     */
    getSupportedSchemes(): Promise<Array<{
        scheme: string;
        network: string;
    }>>;
    /**
     * Create x402 payment payload (what goes in X-PAYMENT header)
     */
    createPaymentPayload(scheme: string, network: string, payload: any): X402PaymentPayload;
    /**
     * Encode payment payload to base64 for X-PAYMENT header
     */
    encodePaymentHeader(payload: X402PaymentPayload): string;
    /**
     * Decode X-PAYMENT header from base64
     */
    decodePaymentHeader(header: string): X402PaymentPayload;
    /**
     * Map Solana network to x402 network format
     */
    private getNetworkId;
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
export declare function createX402Invoice(params: CreateInvoiceParams, network?: 'mainnet-beta' | 'devnet' | 'testnet'): Promise<X402Invoice>;
/**
 * Verify x402 invoice settlement
 */
export declare function verifyX402Settlement(invoice: X402Invoice, paymentHeader: string, network?: 'mainnet-beta' | 'devnet' | 'testnet'): Promise<boolean>;
