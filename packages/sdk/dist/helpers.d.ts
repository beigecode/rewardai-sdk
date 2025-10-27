/**
 * RewardAI Helper Functions
 *
 * User-friendly one-liner functions for common use cases
 */
import type { DistributeResult } from './types';
export interface RewardTopTradersParams {
    wallet: string;
    tokenMint: string;
    prizes: number[];
    traders: Array<{
        address: string;
        username?: string;
    }>;
    network?: 'mainnet-beta' | 'devnet' | 'testnet';
}
export interface AirdropToHoldersParams {
    wallet: string;
    tokenMint: string;
    totalAmount: number;
    proportional: boolean;
    holders?: Array<{
        address: string;
        balance: number;
    }>;
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
    recipients: string[] | Array<{
        address: string;
        name?: string;
    }>;
    message?: string;
    network?: 'mainnet-beta' | 'devnet' | 'testnet';
}
export interface DistributeStakingRewardsParams {
    wallet: string;
    tokenMint: string;
    apyRate: number;
    period: 'daily' | 'weekly' | 'monthly';
    stakers: Array<{
        address: string;
        stakedBalance: number;
    }>;
    network?: 'mainnet-beta' | 'devnet' | 'testnet';
}
export interface RewardEngagementParams {
    wallet: string;
    tokenMint: string;
    multiplier: number;
    contributors: Array<{
        wallet: string;
        engagementScore: number;
        username?: string;
    }>;
    network?: 'mainnet-beta' | 'devnet' | 'testnet';
}
/**
 * Reward top traders from a trading competition
 */
export declare function rewardTopTraders(params: RewardTopTradersParams): Promise<DistributeResult>;
/**
 * Airdrop tokens to all holders proportionally
 */
export declare function airdropToHolders(params: AirdropToHoldersParams): Promise<DistributeResult>;
/**
 * Run a flash giveaway with instant rewards
 */
export declare function flashGiveaway(params: FlashGiveawayParams): Promise<DistributeResult>;
/**
 * Celebrate milestones with special rewards
 */
export declare function rewardMilestone(params: RewardMilestoneParams): Promise<DistributeResult>;
/**
 * Distribute automated staking rewards
 */
export declare function distributeStakingRewards(params: DistributeStakingRewardsParams): Promise<DistributeResult>;
/**
 * Reward active community members based on engagement
 */
export declare function rewardEngagement(params: RewardEngagementParams): Promise<DistributeResult>;
declare const _default: {
    rewardTopTraders: typeof rewardTopTraders;
    airdropToHolders: typeof airdropToHolders;
    flashGiveaway: typeof flashGiveaway;
    rewardMilestone: typeof rewardMilestone;
    distributeStakingRewards: typeof distributeStakingRewards;
    rewardEngagement: typeof rewardEngagement;
};
export default _default;
