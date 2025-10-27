#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quickstartCommand = quickstartCommand;
const pumpbuddy_sdk_1 = require("@beigecode/pumpbuddy-sdk");
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const utils_1 = require("../utils");
async function quickstartCommand(args) {
    console.log(chalk_1.default.bold.green('\n🚀 PumpBuddy Quickstart\n'));
    // Prompt for wallet if not provided
    let wallet = args.wallet;
    if (!wallet) {
        const answers = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'wallet',
                message: 'Enter your Pump.fun reward wallet address:',
                validate: (input) => {
                    if (!input || input.length < 32) {
                        return 'Please enter a valid Solana wallet address';
                    }
                    return true;
                },
            },
        ]);
        wallet = answers.wallet;
    }
    if (!wallet) {
        console.error(chalk_1.default.red('Error: Wallet address is required'));
        process.exit(1);
    }
    const network = args.devnet ? 'devnet' : 'mainnet-beta';
    console.log(chalk_1.default.gray(`\nWallet:  ${wallet}`));
    console.log(chalk_1.default.gray(`Network: ${network}\n`));
    // Initialize SDK
    let spinner = (0, ora_1.default)('Initializing SDK...').start();
    try {
        const sdk = new pumpbuddy_sdk_1.PumpBuddy({
            network,
            verbose: false,
        });
        await sdk.init();
        spinner.succeed('SDK initialized');
        // Download demo recipients
        spinner = (0, ora_1.default)('Downloading demo recipients...').start();
        const recipients = await (0, utils_1.downloadDemoRecipients)();
        spinner.succeed(`Loaded ${recipients.length} demo recipients`);
        // Run dry-run distribution
        spinner = (0, ora_1.default)('Running dry-run distribution...').start();
        const result = await sdk.distribute({
            wallet,
            tokenMint: 'DEMO_TOKEN_MINT',
            recipients,
            dryRun: true,
        });
        spinner.succeed('Dry-run complete!');
        // Print results
        console.log(chalk_1.default.bold.green('\n✓ Quickstart Complete!\n'));
        console.log(chalk_1.default.gray('━'.repeat(60)));
        console.log(chalk_1.default.white(`Recipients:   ${result.totalRecipients}`));
        console.log(chalk_1.default.white(`Total Amount: ${result.totalAmount} tokens`));
        console.log(chalk_1.default.gray('━'.repeat(60)));
        // Next steps
        console.log(chalk_1.default.bold('\n📋 Next Steps:\n'));
        console.log(chalk_1.default.white('1. Review the demo recipients in the summary above'));
        console.log(chalk_1.default.white('2. Edit ') +
            chalk_1.default.cyan('./examples/recipients.csv') +
            chalk_1.default.white(' to add your community'));
        console.log(chalk_1.default.white('3. Run the distribute command:'));
        console.log(chalk_1.default.cyan(`\n   npx pumpbuddy distribute --wallet ${wallet} --token YOUR_TOKEN --recipients ./examples/recipients.csv --dry-run\n`));
        console.log(chalk_1.default.gray('Tip: Remove --dry-run and add --confirm to execute real transfers.\n'));
    }
    catch (error) {
        spinner.fail('Quickstart failed');
        if (error instanceof Error) {
            console.error(chalk_1.default.red(`\n✗ Error: ${error.message}\n`));
        }
        process.exit(1);
    }
}
