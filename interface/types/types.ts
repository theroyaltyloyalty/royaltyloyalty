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
