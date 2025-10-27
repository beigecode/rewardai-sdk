import { Connection, PublicKey, Transaction, Keypair } from '@solana/web3.js';
import { 
  getOrCreateAssociatedTokenAccount, 
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress
} from '@solana/spl-token';
import type {
  RewardAIConfig,
  DistributeParams,
  DistributeResult,
  FundViaX402Params,
  X402Invoice,
  Recipient,
} from './types.js';
import {
  getConnection,
  verifyConnection,
  isValidSolanaAddress,
  formatTokenMint,
  getBalance,
} from './solana.js';
import { createInvoice, verifySettlement } from './x402.js';

/**
 * RewardAI SDK
 * 
 * Main class for distributing Pump.fun token rewards using Coinbase x402.
 */
export class RewardAI {
  private config: RewardAIConfig;
  private connection: Connection | null = null;
  private initialized = false;
  private keypair?: Keypair;

  constructor(config: RewardAIConfig = {}) {
    this.config = {
      network: 'devnet',
      verbose: false,
      ...config,
    };
    this.keypair = config.keypair;
  }

  /**
   * Initialize the SDK
   */
  async init(): Promise<void> {
    if (this.initialized) {
      this.log('SDK already initialized');
      return;
    }

    this.log('Initializing RewardAI SDK...');
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
        description: description || 'Fund RewardAI vault',
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

    // Real distribution logic
    if (!this.keypair) {
      throw new Error(
        'Keypair required for real transfers. Pass keypair in config: new RewardAI({ keypair })'
      );
    }

    if (!this.connection) {
      throw new Error('Connection not established');
    }

    this.log('\n🚀 Executing transfers...\n');

    const tokenMintPubkey = new PublicKey(tokenMint);
    const sourceWalletPubkey = new PublicKey(wallet);
    const decimals = 6; // Pump.fun tokens typically use 6 decimals

    const signatures: string[] = [];
    const errors: string[] = [];
    let distributedCount = 0;
    let failedCount = 0;

    for (const recipient of recipients) {
      try {
        const recipientPubkey = new PublicKey(recipient.wallet);
        const amountToSend = recipient.amount * Math.pow(10, decimals);

        // Get source token account
        const sourceTokenAccount = await getAssociatedTokenAddress(
          tokenMintPubkey,
          sourceWalletPubkey
        );

        // Get or create destination token account
        const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
          this.connection,
          this.keypair,
          tokenMintPubkey,
          recipientPubkey
        );

        // Create transfer instruction
        const transferInstruction = createTransferInstruction(
          sourceTokenAccount,
          destinationTokenAccount.address,
          sourceWalletPubkey,
          amountToSend,
          [],
          TOKEN_PROGRAM_ID
        );

        // Create and send transaction
        const transaction = new Transaction().add(transferInstruction);
        const signature = await this.connection.sendTransaction(
          transaction,
          [this.keypair],
          { skipPreflight: false, preflightCommitment: 'confirmed' }
        );

        // Confirm transaction
        await this.connection.confirmTransaction(signature, 'confirmed');

        signatures.push(signature);
        distributedCount++;
        this.log(`✓ Sent ${recipient.amount} to ${recipient.name || recipient.wallet.substring(0, 8)}... (${signature.substring(0, 8)}...)`);

      } catch (error) {
        failedCount++;
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Failed to send to ${recipient.name || recipient.wallet}: ${errorMsg}`);
        this.log(`✗ Failed: ${recipient.name || recipient.wallet} - ${errorMsg}`);
      }
    }

    this.log(`\n✓ Distribution complete! ${distributedCount}/${recipients.length} successful\n`);

    return {
      success: distributedCount > 0,
      totalRecipients: recipients.length,
      distributedCount,
      failedCount,
      signatures,
      errors: errors.length > 0 ? errors : undefined,
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
export * from './types.js';

// Export helper functions for common use cases
export * from './helpers.js';
