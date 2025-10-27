"use strict";
/**
 * RewardAI Helper Functions
 *
 * User-friendly one-liner functions for common use cases
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewardTopTraders = rewardTopTraders;
exports.airdropToHolders = airdropToHolders;
exports.flashGiveaway = flashGiveaway;
exports.rewardMilestone = rewardMilestone;
exports.distributeStakingRewards = distributeStakingRewards;
exports.rewardEngagement = rewardEngagement;
const index_1 = require("./index");
/**
 * Reward top traders from a trading competition
 */
async function rewardTopTraders(params) {
    const { wallet, tokenMint, prizes, traders, network = 'mainnet-beta' } = params;
    const sdk = new index_1.RewardAI({ network });
    await sdk.init();
    const recipients = traders.slice(0, prizes.length).map((trader, i) => ({
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
async function airdropToHolders(params) {
    const { wallet, tokenMint, totalAmount, proportional, holders, network = 'mainnet-beta' } = params;
    const sdk = new index_1.RewardAI({ network });
    await sdk.init();
    if (!holders || holders.length === 0) {
        throw new Error('No holders provided. Please pass holders array.');
    }
    let recipients;
    if (proportional) {
        const totalBalance = holders.reduce((sum, h) => sum + h.balance, 0);
        recipients = holders.map(holder => ({
            wallet: holder.address,
            amount: Math.floor((holder.balance / totalBalance) * totalAmount),
            name: `Holder: ${holder.balance.toLocaleString()} tokens`,
        }));
    }
    else {
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
async function flashGiveaway(params) {
    const { wallet, tokenMint, amount, winners, network = 'mainnet-beta' } = params;
    const sdk = new index_1.RewardAI({ network });
    await sdk.init();
    const recipients = winners.map((winner, i) => ({
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
async function rewardMilestone(params) {
    const { wallet, tokenMint, amount, recipients, message, network = 'mainnet-beta' } = params;
    const sdk = new index_1.RewardAI({ network });
    await sdk.init();
    const recipientList = recipients.map((recipient, i) => {
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
async function distributeStakingRewards(params) {
    const { wallet, tokenMint, apyRate, period, stakers, network = 'mainnet-beta' } = params;
    const sdk = new index_1.RewardAI({ network });
    await sdk.init();
    // Calculate period rate
    const periodsPerYear = {
        daily: 365,
        weekly: 52,
        monthly: 12,
    };
    const periodRate = apyRate / periodsPerYear[period];
    const recipients = stakers.map(staker => ({
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
async function rewardEngagement(params) {
    const { wallet, tokenMint, multiplier, contributors, network = 'mainnet-beta' } = params;
    const sdk = new index_1.RewardAI({ network });
    await sdk.init();
    const recipients = contributors.map(contributor => ({
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
exports.default = {
    rewardTopTraders,
    airdropToHolders,
    flashGiveaway,
    rewardMilestone,
    distributeStakingRewards,
    rewardEngagement,
};
