import { Transfer } from './infuraTypes';

export interface RoyaltyData {
    totalPaid: string;
    royaltyPayments: RoyaltyPayment[];
}

export interface RoyaltyPayment {
    operator: string;
    payer: string;
    currency: string;
    amount: string;
    tokenId: string;
    transactionHash: string;
    blockNumber: number;
}

export interface TransferWithRoyalty extends Transfer {
    royaltyPayment: RoyaltyPayment | null;
}

export interface OwnerData {
    address: string;
    balance: number;
    tokens: string[];
}

export interface Royalty {
    bps: number;
    percent: number;
}

export interface RoyaltyStats {
    royaltiesPaid: number;
    royaltiesDodged: number;
    royaltiesAmountPaid: string;
    percentagePaid: number;
}

export enum LoyaltyLevel {
    TierOne,
    TierTwo,
    TierThree,
    TierFour,
    TierFive,
    TierSix,
}

export interface OwnerExtended extends OwnerData, RoyaltyStats {
    loyaltyLevel: LoyaltyLevel;
    isFollower: boolean;
}
