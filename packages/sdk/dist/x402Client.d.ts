import { Reward, X402Config, RewardResponse, TransactionStatus } from './types';
/**
 * Coinbase x402 API client for token distribution
 */
export declare class X402Client {
    private config;
    private baseUrl;
    constructor(config: X402Config);
    /**
     * Distribute tokens to multiple recipients
     * @param token - Token symbol to distribute
     * @param rewards - Array of reward recipients and amounts
     * @returns Promise with distribution results
     */
    distribute(token: string, rewards: Reward[]): Promise<RewardResponse>;
    /**
     * Check the status of a transaction
     * @param transactionId - Transaction ID to check
     * @returns Promise with transaction status
     */
    getTransactionStatus(transactionId: string): Promise<TransactionStatus>;
    /**
     * Validate if a string is a valid Solana address
     */
    private isValidSolanaAddress;
    /**
     * Generate a mock Solana transaction signature
     */
    private generateMockSignature;
    /**
     * Simulate network delay
     */
    private simulateDelay;
}
/**
 * Factory function to create an x402 client
 */
export declare function createX402Client(config: X402Config): X402Client;
