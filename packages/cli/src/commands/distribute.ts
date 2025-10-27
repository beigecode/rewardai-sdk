#!/usr/bin/env node

import { RewardAI } from 'rewardai-sdk';
import chalk from 'chalk';
import ora from 'ora';
import { loadRecipientsFromCSV, validateArgs } from '../utils';

interface DistributeArgs {
  wallet: string;
  token: string;
  recipients: string;
  dryRun?: boolean;
  confirm?: boolean;
  devnet?: boolean;
}

export async function distributeCommand(args: DistributeArgs): Promise<void> {
  console.log(chalk.bold.green('\n🎁 RewardAI Distribute\n'));

  // Validate required arguments
  try {
    validateArgs(args);
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`\n✗ ${error.message}\n`));
    }
    process.exit(1);
  }

  const { wallet, token, recipients: recipientsPath, confirm, devnet } = args;
  const isDryRun = !confirm;
  const network = devnet ? 'devnet' : 'mainnet-beta';

  console.log(chalk.gray(`Mode:       ${isDryRun ? 'DRY-RUN' : 'LIVE'}`));
  console.log(chalk.gray(`Wallet:     ${wallet}`));
  console.log(chalk.gray(`Token:      ${token}`));
  console.log(chalk.gray(`Recipients: ${recipientsPath}`));
  console.log(chalk.gray(`Network:    ${network}\n`));

  // Warning for live mode
  if (!isDryRun) {
    console.log(
      chalk.yellow(
        '⚠️  WARNING: You are about to execute REAL token transfers!\n'
      )
    );
  }

  let spinner = ora('Loading recipients...').start();

  try {
    // Load recipients from CSV
    const recipients = loadRecipientsFromCSV(recipientsPath);
    spinner.succeed(`Loaded ${recipients.length} recipients`);

    // Initialize SDK
    spinner = ora('Initializing SDK...').start();
    const sdk = new RewardAI({
      network,
      verbose: false,
    });

    await sdk.init();
    spinner.succeed('SDK initialized');

    // Execute distribution
    const actionText = isDryRun
      ? 'Running dry-run distribution...'
      : 'Executing distribution...';
    spinner = ora(actionText).start();

    const result = await sdk.distribute({
      wallet,
      tokenMint: token,
      recipients,
      dryRun: isDryRun,
    });

    spinner.succeed(
      isDryRun ? 'Dry-run complete!' : 'Distribution complete!'
    );

    // Print results
    console.log(chalk.bold.green('\n✓ Distribution Summary\n'));
    console.log(chalk.gray('━'.repeat(60)));
    console.log(
      chalk.white(
        `Total Recipients:   ${result.totalRecipients}`
      )
    );
    console.log(
      chalk.white(
        `Successfully Sent:  ${result.distributedCount}`
      )
    );
    console.log(
      chalk.white(`Failed:             ${result.failedCount}`)
    );
    console.log(
      chalk.white(`Total Amount:       ${result.totalAmount} tokens`)
    );
    console.log(chalk.gray('━'.repeat(60)));

    if (result.signatures && result.signatures.length > 0) {
      console.log(chalk.bold('\n📝 Transaction Signatures:\n'));
      result.signatures.forEach((sig: string, i: number) => {
        console.log(chalk.gray(`${i + 1}. ${sig}`));
      });
      console.log();
    }

    if (isDryRun) {
      console.log(chalk.bold('\n📋 To execute real transfers:\n'));
      console.log(
        chalk.cyan(
          `   npx pumpbuddy distribute --wallet ${wallet} --token ${token} --recipients ${recipientsPath} --confirm\n`
        )
      );
    } else {
      console.log(chalk.bold.green('\n🎉 Tokens distributed successfully!\n'));
    }
  } catch (error) {
    spinner.fail('Distribution failed');
    if (error instanceof Error) {
      console.error(chalk.red(`\n✗ Error: ${error.message}\n`));
    }
    process.exit(1);
  }
}

