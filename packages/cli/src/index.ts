#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { quickstartCommand } from './commands/quickstart';
import { distributeCommand } from './commands/distribute';

yargs(hideBin(process.argv))
  .scriptName('pumpbuddy')
  .usage('$0 <command> [options]')
  .command(
    'quickstart',
    'Quick setup guide with demo distribution',
    (yargs) => {
      return yargs
        .option('wallet', {
          type: 'string',
          describe: 'Your Pump.fun reward wallet address',
        })
        .option('devnet', {
          type: 'boolean',
          describe: 'Use Solana devnet',
          default: true,
        });
    },
    (argv) => {
      quickstartCommand(argv).catch((error) => {
        console.error(error);
        process.exit(1);
      });
    }
  )
  .command(
    'distribute',
    'Distribute tokens to recipients',
    (yargs) => {
      return yargs
        .option('wallet', {
          type: 'string',
          describe: 'Source wallet address',
          demandOption: true,
        })
        .option('token', {
          type: 'string',
          describe: 'Token mint address or Pump.fun identifier',
          demandOption: true,
        })
        .option('recipients', {
          type: 'string',
          describe: 'Path to recipients CSV file',
          demandOption: true,
        })
        .option('dry-run', {
          type: 'boolean',
          describe: 'Preview distribution without executing',
          default: true,
        })
        .option('confirm', {
          type: 'boolean',
          describe: 'Execute real distribution (overrides dry-run)',
          default: false,
        })
        .option('devnet', {
          type: 'boolean',
          describe: 'Use Solana devnet',
          default: false,
        });
    },
    (argv) => {
      distributeCommand(argv).catch((error) => {
        console.error(error);
        process.exit(1);
      });
    }
  )
  .demandCommand(1, 'Please specify a command')
  .help()
  .alias('help', 'h')
  .version('0.1.0')
  .alias('version', 'v')
  .strict()
  .parse();

