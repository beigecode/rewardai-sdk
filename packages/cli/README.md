# rewardai-cli

Command-line interface for RewardAI SDK.

## Installation

```bash
npm install -g rewardai
```

## Commands

### `quickstart`

Quick setup guide with demo distribution.

```bash
rewardai quickstart --wallet YOUR_WALLET_ADDRESS
```

Options:
- `--wallet` - Your Pump.fun reward wallet address (will prompt if not provided)
- `--devnet` - Use Solana devnet (default: true)

### `distribute`

Distribute tokens to recipients.

```bash
# Dry-run (safe preview)
rewardai distribute \
  --wallet YOUR_WALLET \
  --token TOKEN_MINT \
  --recipients ./recipients.csv \
  --dry-run

# Real distribution
rewardai distribute \
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
rewardai quickstart

# Dry-run distribution
rewardai distribute \
  --wallet 5Ey... \
  --token PUMP... \
  --recipients ./examples/recipients.csv \
  --dry-run

# Real distribution
rewardai distribute \
  --wallet 5Ey... \
  --token PUMP... \
  --recipients ./examples/recipients.csv \
  --confirm
```

## License

MIT

