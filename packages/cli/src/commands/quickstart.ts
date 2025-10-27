#!/usr/bin/env node

import { PumpBuddy } from '@pumpbuddy/sdk';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { downloadDemoRecipients } from '../utils';

interface QuickstartArgs {
  wallet?: string;
  devnet?: boolean;
}

export async function quickstartCommand(args: QuickstartArgs): Promise<void> {
  console.log(chalk.bold.green('\n🚀 PumpBuddy Quickstart\n'));

  // Prompt for wallet if not provided
  let wallet = args.wallet;
  if (!wallet) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'wallet',
        message: 'Enter your Pump.fun reward wallet address:',
        validate: (input: string) => {
          if (!input || input.length < 32) {
            return 'Please enter a valid Solana wallet address';
          }
          return true;
        },
      },
    ]);
    wallet = answers.wallet;
  }

  const network = args.devnet ? 'devnet' : 'mainnet-beta';

  console.log(chalk.gray(`\nWallet:  ${wallet}`));
  console.log(chalk.gray(`Network: ${network}\n`));

  // Initialize SDK
  let spinner = ora('Initializing SDK...').start();
  
  try {
    const sdk = new PumpBuddy({
      network,
      verbose: false,
    });

    await sdk.init();
    spinner.succeed('SDK initialized');

    // Download demo recipients
    spinner = ora('Downloading demo recipients...').start();
    const recipients = await downloadDemoRecipients();
    spinner.succeed(`Loaded ${recipients.length} demo recipients`);

    // Run dry-run distribution
    spinner = ora('Running dry-run distribution...').start();
    const result = await sdk.distribute({
      wallet,
      tokenMint: 'DEMO_TOKEN_MINT',
      recipients,
      dryRun: true,
    });

    spinner.succeed('Dry-run complete!');

    // Print results
    console.log(chalk.bold.green('\n✓ Quickstart Complete!\n'));
    console.log(chalk.gray('━'.repeat(60)));
    console.log(
      chalk.white(`Recipients:   ${result.totalRecipients}`)
    );
    console.log(
      chalk.white(`Total Amount: ${result.totalAmount} tokens`)
    );
    console.log(chalk.gray('━'.repeat(60)));

    // Next steps
    console.log(chalk.bold('\n📋 Next Steps:\n'));
    console.log(chalk.white('1. Review the demo recipients in the summary above'));
    console.log(
      chalk.white('2. Edit ') +
        chalk.cyan('./examples/recipients.csv') +
        chalk.white(' to add your community')
    );
    console.log(chalk.white('3. Run the distribute command:'));
    console.log(
      chalk.cyan(
        `\n   npx pumpbuddy distribute --wallet ${wallet} --token YOUR_TOKEN --recipients ./examples/recipients.csv --dry-run\n`
      )
    );
    console.log(
      chalk.gray(
        'Tip: Remove --dry-run and add --confirm to execute real transfers.\n'
      )
    );
  } catch (error) {
    spinner.fail('Quickstart failed');
    if (error instanceof Error) {
      console.error(chalk.red(`\n✗ Error: ${error.message}\n`));
    }
    process.exit(1);
  }
}

