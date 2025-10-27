#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.distributeCommand = distributeCommand;
const pumpbuddy_sdk_1 = require("@beigecode/pumpbuddy-sdk");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const utils_1 = require("../utils");
async function distributeCommand(args) {
    console.log(chalk_1.default.bold.green('\n🎁 PumpBuddy Distribute\n'));
    // Validate required arguments
    try {
        (0, utils_1.validateArgs)(args);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(chalk_1.default.red(`\n✗ ${error.message}\n`));
        }
        process.exit(1);
    }
    const { wallet, token, recipients: recipientsPath, confirm, devnet } = args;
    const isDryRun = !confirm;
    const network = devnet ? 'devnet' : 'mainnet-beta';
    console.log(chalk_1.default.gray(`Mode:       ${isDryRun ? 'DRY-RUN' : 'LIVE'}`));
    console.log(chalk_1.default.gray(`Wallet:     ${wallet}`));
    console.log(chalk_1.default.gray(`Token:      ${token}`));
    console.log(chalk_1.default.gray(`Recipients: ${recipientsPath}`));
    console.log(chalk_1.default.gray(`Network:    ${network}\n`));
    // Warning for live mode
    if (!isDryRun) {
        console.log(chalk_1.default.yellow('⚠️  WARNING: You are about to execute REAL token transfers!\n'));
    }
    let spinner = (0, ora_1.default)('Loading recipients...').start();
    try {
        // Load recipients from CSV
        const recipients = (0, utils_1.loadRecipientsFromCSV)(recipientsPath);
        spinner.succeed(`Loaded ${recipients.length} recipients`);
        // Initialize SDK
        spinner = (0, ora_1.default)('Initializing SDK...').start();
        const sdk = new pumpbuddy_sdk_1.PumpBuddy({
            network,
            verbose: false,
        });
        await sdk.init();
        spinner.succeed('SDK initialized');
        // Execute distribution
        const actionText = isDryRun
            ? 'Running dry-run distribution...'
            : 'Executing distribution...';
        spinner = (0, ora_1.default)(actionText).start();
        const result = await sdk.distribute({
            wallet,
            tokenMint: token,
            recipients,
            dryRun: isDryRun,
        });
        spinner.succeed(isDryRun ? 'Dry-run complete!' : 'Distribution complete!');
        // Print results
        console.log(chalk_1.default.bold.green('\n✓ Distribution Summary\n'));
        console.log(chalk_1.default.gray('━'.repeat(60)));
        console.log(chalk_1.default.white(`Total Recipients:   ${result.totalRecipients}`));
        console.log(chalk_1.default.white(`Successfully Sent:  ${result.distributedCount}`));
        console.log(chalk_1.default.white(`Failed:             ${result.failedCount}`));
        console.log(chalk_1.default.white(`Total Amount:       ${result.totalAmount} tokens`));
        console.log(chalk_1.default.gray('━'.repeat(60)));
        if (result.signatures && result.signatures.length > 0) {
            console.log(chalk_1.default.bold('\n📝 Transaction Signatures:\n'));
            result.signatures.forEach((sig, i) => {
                console.log(chalk_1.default.gray(`${i + 1}. ${sig}`));
            });
            console.log();
        }
        if (isDryRun) {
            console.log(chalk_1.default.bold('\n📋 To execute real transfers:\n'));
            console.log(chalk_1.default.cyan(`   npx pumpbuddy distribute --wallet ${wallet} --token ${token} --recipients ${recipientsPath} --confirm\n`));
        }
        else {
            console.log(chalk_1.default.bold.green('\n🎉 Tokens distributed successfully!\n'));
        }
    }
    catch (error) {
        spinner.fail('Distribution failed');
        if (error instanceof Error) {
            console.error(chalk_1.default.red(`\n✗ Error: ${error.message}\n`));
        }
        process.exit(1);
    }
}
