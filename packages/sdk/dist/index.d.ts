import type { RewardAIConfig, DistributeParams, DistributeResult, FundViaX402Params, X402Invoice } from './types';
/**
 * RewardAI SDK
 *
 * Main class for distributing Pump.fun token rewards using Coinbase x402.
 */
export declare class RewardAI {
    private config;
    private connection;
    private initialized;
    constructor(config?: RewardAIConfig);
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
export * from './helpers';
