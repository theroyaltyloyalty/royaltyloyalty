import { Transfer } from './infuraTypes';

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
