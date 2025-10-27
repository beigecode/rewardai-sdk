import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
/**
 * Validate a Solana wallet address
 */
export function isValidSolanaAddress(address) {
    try {
        new PublicKey(address);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Get Solana RPC connection
 */
export function getConnection(config) {
    const endpoint = config.rpcEndpoint || clusterApiUrl(config.network || 'devnet');
    return new Connection(endpoint, 'confirmed');
}
/**
 * Verify Solana connection
 */
export async function verifyConnection(connection) {
    try {
        const version = await connection.getVersion();
        return !!version;
    }
    catch (error) {
        console.error('Failed to connect to Solana:', error);
        return false;
    }
}
/**
 * Get account balance (SOL)
 */
export async function getBalance(connection, address) {
    try {
        const publicKey = new PublicKey(address);
        const balance = await connection.getBalance(publicKey);
        return balance / 1e9; // Convert lamports to SOL
    }
    catch (error) {
        console.error('Failed to get balance:', error);
        return 0;
    }
}
/**
 * Format token mint address (basic validation/formatting)
 */
export function formatTokenMint(mint) {
    // Check if it's a valid Solana address
    if (isValidSolanaAddress(mint)) {
        return mint;
    }
    // If it's a Pump.fun identifier, this is where we'd convert it
    // For now, return as-is with a comment marker
    console.warn('Token mint appears to be a Pump.fun identifier. Real implementation would resolve this to a mint address.');
    return mint;
}
