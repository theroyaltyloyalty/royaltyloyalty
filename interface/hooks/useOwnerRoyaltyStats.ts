import { TransferWithRoyalty } from 'types/types';

interface Stats {
    transfers: number;
    royaltiesPaid: number;
    royaltiesDodged: number;
    royaltiesAmountPaid: string;
    percentagePaid: number;
}

export default function useOwnerRoyaltyStats(
    ownerAddress: string,
    ownersToTransfers: Record<string, number[]>,
    transfers: TransferWithRoyalty[]
) {}
