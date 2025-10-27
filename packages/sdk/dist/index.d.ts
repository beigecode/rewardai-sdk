import type { PumpBuddyConfig, DistributeParams, DistributeResult, FundViaX402Params, X402Invoice } from './types';
/**
 * PumpBuddy SDK
 *
 * Main class for distributing Pump.fun token rewards using Coinbase x402.
 */
export declare class PumpBuddy {
    private config;
    private connection;
    private initialized;
    constructor(config?: PumpBuddyConfig);
    /**
     * Initialize the SDK
     */
    init(): Promise<void>;
    /**
     * Fund a vault via Coinbase x402
     */
    fundViaX402(params: FundViaX402Params): Promise<X402Invoice>;
    /**
     * Distribute tokens to recipients
     */
    distribute(params: DistributeParams): Promise<DistributeResult>;
    /**
     * Get wallet balance
     */
    getBalance(wallet: string): Promise<number>;
    /**
     * Verify x402 invoice settlement
     */
    verifyInvoice(invoice: X402Invoice, paymentHeader: string): Promise<boolean>;
    private ensureInitialized;
    private log;
    private printDistributionSummary;
}
export * from './types';
