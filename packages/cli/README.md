# pumpbuddy-cli

Command-line interface for PumpBuddy SDK.

## Installation

```bash
npm install -g pumpbuddy
```

## Commands

### `quickstart`

Quick setup guide with demo distribution.

```bash
pumpbuddy quickstart --wallet YOUR_WALLET_ADDRESS
```

Options:
- `--wallet` - Your Pump.fun reward wallet address (will prompt if not provided)
- `--devnet` - Use Solana devnet (default: true)

### `distribute`

Distribute tokens to recipients.

```bash
# Dry-run (safe preview)
pumpbuddy distribute \
  --wallet YOUR_WALLET \
  --token TOKEN_MINT \
  --recipients ./recipients.csv \
  --dry-run

# Real distribution
pumpbuddy distribute \
  --wallet YOUR_WALLET \
  --token TOKEN_MINT \
  --recipients ./recipients.csv \
  --confirm
```

Options:
- `--wallet` - Source wallet address (required)
- `--token` - Token mint address (required)
- `--recipients` - Path to CSV file (required)
- `--dry-run` - Preview mode (default: true)
- `--confirm` - Execute real transfers
- `--devnet` - Use Solana devnet

## Recipients CSV Format

```csv
wallet,amount,name
SolanaAddress1...,10,Alice
SolanaAddress2...,25,Bob
SolanaAddress3...,15,Charlie
```

## Examples

```bash
# Quick start
pumpbuddy quickstart

# Dry-run distribution
pumpbuddy distribute \
  --wallet 5Ey... \
  --token PUMP... \
  --recipients ./examples/recipients.csv \
  --dry-run

# Real distribution
pumpbuddy distribute \
  --wallet 5Ey... \
  --token PUMP... \
  --recipients ./examples/recipients.csv \
  --confirm
```

## License

MIT

