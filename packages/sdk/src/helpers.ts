/**
 * RewardAI Helper Functions
 * 
 * User-friendly one-liner functions for common use cases
 */

import { RewardAI } from './index.js';
import type { Recipient, DistributeResult } from './types.js';

export interface RewardTopTradersParams {
  wallet: string;
  tokenMint: string;
  prizes: number[];
  traders: Array<{ address: string; username?: string }>;
  network?: 'mainnet-beta' | 'devnet' | 'testnet';
}

export interface AirdropToHoldersParams {
  wallet: string;
  tokenMint: string;
  totalAmount: number;
  proportional: boolean;
  holders?: Array<{ address: string; balance: number }>;
  network?: 'mainnet-beta' | 'devnet' | 'testnet';
}

export interface FlashGiveawayParams {
  wallet: string;
  tokenMint: string;
  amount: number;
  winners: string[];
  network?: 'mainnet-beta' | 'devnet' | 'testnet';
}

export interface RewardMilestoneParams {
  wallet: string;
  tokenMint: string;
  amount: number;
  recipients: string[] | Array<{ address: string; name?: string }>;
  message?: string;
  network?: 'mainnet-beta' | 'devnet' | 'testnet';
}

export interface DistributeStakingRewardsParams {
  wallet: string;
  tokenMint: string;
  apyRate: number;
  period: 'daily' | 'weekly' | 'monthly';
  stakers: Array<{ address: string; stakedBalance: number }>;
  network?: 'mainnet-beta' | 'devnet' | 'testnet';
}

export interface RewardEngagementParams {
  wallet: string;
  tokenMint: string;
  multiplier: number;
  contributors: Array<{ wallet: string; engagementScore: number; username?: string }>;
  network?: 'mainnet-beta' | 'devnet' | 'testnet';
}

/**
 * Reward top traders from a trading competition
 */
export async function rewardTopTraders(
  params: RewardTopTradersParams
): Promise<DistributeResult> {
  const { wallet, tokenMint, prizes, traders, network = 'mainnet-beta' } = params;

  const sdk = new RewardAI({ network });
  await sdk.init();

  const recipients: Recipient[] = traders.slice(0, prizes.length).map((trader, i) => ({
    wallet: trader.address,
    amount: prizes[i],
    name: trader.username ? `Rank #${i + 1}: ${trader.username}` : `Rank #${i + 1}`,
  }));

  return sdk.distribute({
    wallet,
    tokenMint,
    recipients,
    dryRun: false,
  });
}

/**
 * Airdrop tokens to all holders proportionally
 */
export async function airdropToHolders(
  params: AirdropToHoldersParams
): Promise<DistributeResult> {
  const { wallet, tokenMint, totalAmount, proportional, holders, network = 'mainnet-beta' } = params;

  const sdk = new RewardAI({ network });
  await sdk.init();

  if (!holders || holders.length === 0) {
    throw new Error('No holders provided. Please pass holders array.');
  }

  let recipients: Recipient[];

  if (proportional) {
    const totalBalance = holders.reduce((sum, h) => sum + h.balance, 0);
    recipients = holders.map(holder => ({
      wallet: holder.address,
      amount: Math.floor((holder.balance / totalBalance) * totalAmount),
      name: `Holder: ${holder.balance.toLocaleString()} tokens`,
    }));
  } else {
    const amountPerHolder = Math.floor(totalAmount / holders.length);
    recipients = holders.map(holder => ({
      wallet: holder.address,
      amount: amountPerHolder,
    }));
  }

  return sdk.distribute({
    wallet,
    tokenMint,
    recipients,
    dryRun: false,
  });
}

/**
 * Run a flash giveaway with instant rewards
 */
export async function flashGiveaway(
  params: FlashGiveawayParams
): Promise<DistributeResult> {
  const { wallet, tokenMint, amount, winners, network = 'mainnet-beta' } = params;

  const sdk = new RewardAI({ network });
  await sdk.init();

  const recipients: Recipient[] = winners.map((winner, i) => ({
    wallet: winner,
    amount,
    name: `Winner #${i + 1}`,
  }));

  return sdk.distribute({
    wallet,
    tokenMint,
    recipients,
    dryRun: false,
  });
}

/**
 * Celebrate milestones with special rewards
 */
export async function rewardMilestone(
  params: RewardMilestoneParams
): Promise<DistributeResult> {
  const { wallet, tokenMint, amount, recipients, message, network = 'mainnet-beta' } = params;

  const sdk = new RewardAI({ network });
  await sdk.init();

  const recipientList: Recipient[] = recipients.map((recipient, i) => {
    if (typeof recipient === 'string') {
      return {
        wallet: recipient,
        amount,
        name: message || `Milestone Reward #${i + 1}`,
      };
    }
    return {
      wallet: recipient.address,
      amount,
      name: recipient.name || message || `Milestone Reward #${i + 1}`,
    };
  });

  return sdk.distribute({
    wallet,
    tokenMint,
    recipients: recipientList,
    dryRun: false,
  });
}

/**
 * Distribute automated staking rewards
 */
export async function distributeStakingRewards(
  params: DistributeStakingRewardsParams
): Promise<DistributeResult> {
  const { wallet, tokenMint, apyRate, period, stakers, network = 'mainnet-beta' } = params;

  const sdk = new RewardAI({ network });
  await sdk.init();

  // Calculate period rate
  const periodsPerYear: { [key: string]: number } = {
    daily: 365,
    weekly: 52,
    monthly: 12,
  };

  const periodRate = apyRate / periodsPerYear[period];

  const recipients: Recipient[] = stakers.map(staker => ({
    wallet: staker.address,
    amount: Math.floor(staker.stakedBalance * periodRate),
    name: `Staker: ${staker.stakedBalance.toLocaleString()} tokens`,
  }));

  return sdk.distribute({
    wallet,
    tokenMint,
    recipients,
    dryRun: false,
  });
}

/**
 * Reward active community members based on engagement
 */
export async function rewardEngagement(
  params: RewardEngagementParams
): Promise<DistributeResult> {
  const { wallet, tokenMint, multiplier, contributors, network = 'mainnet-beta' } = params;

  const sdk = new RewardAI({ network });
  await sdk.init();

  const recipients: Recipient[] = contributors.map(contributor => ({
    wallet: contributor.wallet,
    amount: contributor.engagementScore * multiplier,
    name: contributor.username
      ? `${contributor.username} - ${contributor.engagementScore} pts`
      : `Contributor: ${contributor.engagementScore} pts`,
  }));

  return sdk.distribute({
    wallet,
    tokenMint,
    recipients,
    dryRun: false,
  });
}

// Export all helper functions
export default {
  rewardTopTraders,
  airdropToHolders,
  flashGiveaway,
  rewardMilestone,
  distributeStakingRewards,
  rewardEngagement,
};

