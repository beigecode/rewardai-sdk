import { Connection } from '@solana/web3.js';
import type { PumpBuddyConfig } from './types';
/**
 * Validate a Solana wallet address
 */
export declare function isValidSolanaAddress(address: string): boolean;
/**
 * Get Solana RPC connection
 */
export declare function getConnection(config: PumpBuddyConfig): Connection;
/**
 * Verify Solana connection
 */
export declare function verifyConnection(connection: Connection): Promise<boolean>;
/**
 * Get account balance (SOL)
 */
export declare function getBalance(connection: Connection, address: string): Promise<number>;
/**
 * Format token mint address (basic validation/formatting)
 */
export declare function formatTokenMint(mint: string): string;
