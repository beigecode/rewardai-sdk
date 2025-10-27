import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import type { PumpBuddyConfig } from './types';

/**
 * Validate a Solana wallet address
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get Solana RPC connection
 */
export function getConnection(config: PumpBuddyConfig): Connection {
  const endpoint =
    config.rpcEndpoint || clusterApiUrl(config.network || 'devnet');
  return new Connection(endpoint, 'confirmed');
}

/**
 * Verify Solana connection
 */
export async function verifyConnection(
  connection: Connection
): Promise<boolean> {
  try {
    const version = await connection.getVersion();
    return !!version;
  } catch (error) {
    console.error('Failed to connect to Solana:', error);
    return false;
  }
}

/**
 * Get account balance (SOL)
 */
export async function getBalance(
  connection: Connection,
  address: string
): Promise<number> {
  try {
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return balance / 1e9; // Convert lamports to SOL
  } catch (error) {
    console.error('Failed to get balance:', error);
    return 0;
  }
}

/**
 * Format token mint address (basic validation/formatting)
 */
export function formatTokenMint(mint: string): string {
  // Check if it's a valid Solana address
  if (isValidSolanaAddress(mint)) {
    return mint;
  }
  
  // If it's a Pump.fun identifier, this is where we'd convert it
  // For now, return as-is with a comment marker
  console.warn(
    'Token mint appears to be a Pump.fun identifier. Real implementation would resolve this to a mint address.'
  );
  return mint;
}

