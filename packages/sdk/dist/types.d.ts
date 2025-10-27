/**
 * SDK Configuration
 */
export interface RewardAIConfig {
    /** Solana network: 'mainnet-beta' | 'devnet' | 'testnet' */
    network?: 'mainnet-beta' | 'devnet' | 'testnet';
    /** Custom RPC endpoint (optional) */
    rpcEndpoint?: string;
    /** Enable verbose logging */
    verbose?: boolean;
}
/**
 * Recipient for token distribution
 */
export interface Recipient {
    /** Solana wallet address */
    wallet: string;
    /** Amount of tokens to send */
    amount: number;
    /** Optional identifier/name */
    name?: string;
}
/**
 * Distribution parameters
 */
export interface DistributeParams {
    /** Source wallet address */
    wallet: string;
    /** Token mint address or Pump.fun identifier */
    tokenMint: string;
    /** List of recipients */
    recipients: Recipient[];
    /** Dry-run mode (no actual transactions) */
    dryRun?: boolean;
}
/**
 * Distribution result
 */
export interface DistributeResult {
    /** Success status */
    success: boolean;
    /** Total recipients processed */
    totalRecipients: number;
    /** Successfully distributed count */
    distributedCount: number;
    /** Failed distribution count */
    failedCount: number;
    /** Transaction signatures (if not dry-run) */
    signatures?: string[];
    /** Error messages (if any) */
    errors?: string[];
    /** Total amount distributed */
    totalAmount: number;
    /** Dry-run mode indicator */
    isDryRun: boolean;
}
/**
 * x402 Invoice
 */
export interface X402Invoice {
    /** Invoice ID */
    id: string;
    /** Token mint address */
    tokenMint: string;
    /** Amount requested */
    amount: number;
    /** Recipient address */
    recipient: string;
    /** Invoice status */
    status: 'pending' | 'paid' | 'expired';
    /** Creation timestamp */
    createdAt: string;
    /** Expiration timestamp */
    expiresAt: string;
    /** Payment URL (Coinbase x402) */
    paymentUrl?: string;
}
/**
 * x402 Invoice creation parameters
 */
export interface CreateInvoiceParams {
    /** Token mint address */
    tokenMint: string;
    /** Amount to request */
    amount: number;
    /** Recipient wallet */
    recipient: string;
    /** Optional description */
    description?: string;
}
/**
 * Funding parameters via x402
 */
export interface FundViaX402Params {
    /** Amount to fund */
    amount: number;
    /** Token mint address */
    tokenMint: string;
    /** Vault/recipient address */
    toVault: string;
    /** Optional description */
    description?: string;
}
