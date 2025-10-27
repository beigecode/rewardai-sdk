import { Connection } from '@solana/web3.js';
import type {
  PumpBuddyConfig,
  DistributeParams,
  DistributeResult,
  FundViaX402Params,
  X402Invoice,
  Recipient,
} from './types';
import {
  getConnection,
  verifyConnection,
  isValidSolanaAddress,
  formatTokenMint,
  getBalance,
} from './solana';
import { createInvoice, verifySettlement } from './x402';

/**
 * PumpBuddy SDK
 * 
 * Main class for distributing Pump.fun token rewards using Coinbase x402.
 */
export class PumpBuddy {
  private config: PumpBuddyConfig;
  private connection: Connection | null = null;
  private initialized = false;

  constructor(config: PumpBuddyConfig = {}) {
    this.config = {
      network: 'devnet',
      verbose: false,
      ...config,
    };
  }

  /**
   * Initialize the SDK
   */
  async init(): Promise<void> {
    if (this.initialized) {
      this.log('SDK already initialized');
      return;
    }

    this.log('Initializing PumpBuddy SDK...');
    this.log(`Network: ${this.config.network}`);

    // Set up Solana connection
    this.connection = getConnection(this.config);

    // Verify connection
    const connected = await verifyConnection(this.connection);
    if (!connected) {
      throw new Error('Failed to connect to Solana network');
    }

    this.initialized = true;
    this.log('✓ SDK initialized successfully\n');
  }

  /**
   * Fund a vault via Coinbase x402
   */
  async fundViaX402(params: FundViaX402Params): Promise<X402Invoice> {
    this.ensureInitialized();

    const { amount, tokenMint, toVault, description } = params;

    this.log('\n💰 Funding via x402...');
    this.log(`Amount:      ${amount}`);
    this.log(`Token:       ${tokenMint}`);
    this.log(`Vault:       ${toVault}`);

    // Validate addresses
    if (!isValidSolanaAddress(toVault)) {
      throw new Error('Invalid vault address');
    }

    // Create x402 invoice with network from config
    const invoice = await createInvoice(
      {
        tokenMint: formatTokenMint(tokenMint),
        amount,
        recipient: toVault,
        description: description || 'Fund PumpBuddy vault',
      },
      this.config.network || 'devnet'
    );

    this.log('\n📋 Next steps:');
    this.log(`1. Pay the invoice at: ${invoice.paymentUrl || 'N/A'}`);
    this.log('2. Wait for settlement confirmation');
    this.log('3. Proceed with distribution\n');

    return invoice;
  }

  /**
   * Distribute tokens to recipients
   */
  async distribute(params: DistributeParams): Promise<DistributeResult> {
    this.ensureInitialized();

    const { wallet, tokenMint, recipients, dryRun = true } = params;

    this.log('\n🎁 Starting distribution...');
    this.log(`Mode:        ${dryRun ? 'DRY-RUN (safe)' : 'LIVE'}`);
    this.log(`Wallet:      ${wallet}`);
    this.log(`Token:       ${tokenMint}`);
    this.log(`Recipients:  ${recipients.length}`);

    // Validate wallet
    if (!isValidSolanaAddress(wallet)) {
      throw new Error('Invalid wallet address');
    }

    // Validate all recipients
    const invalidRecipients = recipients.filter(
      (r) => !isValidSolanaAddress(r.wallet)
    );
    if (invalidRecipients.length > 0) {
      throw new Error(
        `Invalid recipient addresses: ${invalidRecipients.map((r) => r.name || r.wallet).join(', ')}`
      );
    }

    // Calculate total
    const totalAmount = recipients.reduce((sum, r) => sum + r.amount, 0);

    // Display summary table
    this.printDistributionSummary(recipients, totalAmount, dryRun);

    if (dryRun) {
      this.log('\n✓ Dry-run complete. No transactions were executed.\n');
      this.log('To execute the real distribution, run with --confirm flag.\n');

      return {
        success: true,
        totalRecipients: recipients.length,
        distributedCount: recipients.length,
        failedCount: 0,
        totalAmount,
        isDryRun: true,
      };
    }

    // Real distribution logic (stub for now)
    this.log('\n🚀 Executing transfers...');
    this.log(
      '⚠️  This is a STUB. Real implementation will execute SPL token transfers.\n'
    );

    // Simulate transfers
    const signatures: string[] = [];
    for (const recipient of recipients) {
      const sig = `sig_${Math.random().toString(36).substring(7)}`;
      signatures.push(sig);
      this.log(`✓ Sent ${recipient.amount} to ${recipient.name || recipient.wallet}`);
    }

    this.log('\n✓ Distribution complete!\n');

    return {
      success: true,
      totalRecipients: recipients.length,
      distributedCount: recipients.length,
      failedCount: 0,
      signatures,
      totalAmount,
      isDryRun: false,
    };
  }

  /**
   * Get wallet balance
   */
  async getBalance(wallet: string): Promise<number> {
    this.ensureInitialized();

    if (!this.connection) {
      throw new Error('Connection not established');
    }

    return getBalance(this.connection, wallet);
  }

  /**
   * Verify x402 invoice settlement
   */
  async verifyInvoice(
    invoice: X402Invoice,
    paymentHeader: string
  ): Promise<boolean> {
    return verifySettlement(
      invoice,
      paymentHeader,
      this.config.network || 'devnet'
    );
  }

  // Private helper methods

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('SDK not initialized. Call init() first.');
    }
  }

  private log(message: string): void {
    if (this.config.verbose !== false) {
      console.log(message);
    }
  }

  private printDistributionSummary(
    recipients: Recipient[],
    totalAmount: number,
    dryRun: boolean
  ): void {
    console.log('\n┌─────────────────────────────────────────────────────────────┐');
    console.log(`│ ${dryRun ? '🧪 DRY-RUN' : '🚀 LIVE'} Distribution Summary                      │`);
    console.log('├─────────────────────────────────────────────────────────────┤');
    console.log(`│ Total Recipients: ${recipients.length.toString().padEnd(42)} │`);
    console.log(`│ Total Amount:     ${totalAmount.toString().padEnd(42)} │`);
    console.log('├─────────────────────────────────────────────────────────────┤');

    recipients.forEach((r, i) => {
      const name = r.name || `Recipient ${i + 1}`;
      const line = `${name.substring(0, 20).padEnd(20)} → ${r.amount.toString().padEnd(10)} tokens`;
      console.log(`│ ${line.padEnd(59)} │`);
    });

    console.log('└─────────────────────────────────────────────────────────────┘\n');
  }
}

// Export types
export * from './types';
