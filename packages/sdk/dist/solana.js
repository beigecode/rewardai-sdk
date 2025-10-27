"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidSolanaAddress = isValidSolanaAddress;
exports.getConnection = getConnection;
exports.verifyConnection = verifyConnection;
exports.getBalance = getBalance;
exports.formatTokenMint = formatTokenMint;
const web3_js_1 = require("@solana/web3.js");
/**
 * Validate a Solana wallet address
 */
function isValidSolanaAddress(address) {
    try {
        new web3_js_1.PublicKey(address);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Get Solana RPC connection
 */
function getConnection(config) {
    const endpoint = config.rpcEndpoint || (0, web3_js_1.clusterApiUrl)(config.network || 'devnet');
    return new web3_js_1.Connection(endpoint, 'confirmed');
}
/**
 * Verify Solana connection
 */
async function verifyConnection(connection) {
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
async function getBalance(connection, address) {
    try {
        const publicKey = new web3_js_1.PublicKey(address);
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
function formatTokenMint(mint) {
    // Check if it's a valid Solana address
    if (isValidSolanaAddress(mint)) {
        return mint;
    }
    // If it's a Pump.fun identifier, this is where we'd convert it
    // For now, return as-is with a comment marker
    console.warn('Token mint appears to be a Pump.fun identifier. Real implementation would resolve this to a mint address.');
    return mint;
}
