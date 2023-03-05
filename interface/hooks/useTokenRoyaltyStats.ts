import { TransferWithRoyalty, RoyaltyStats } from 'types/types';
import { BigNumber } from 'ethers';

export default function useTokenRoyaltyStats(
    tokenTransfers?: number[],
    transfers?: TransferWithRoyalty[]
) {
    const stats: RoyaltyStats = {
        royaltiesPaid: 0,
        royaltiesDodged: 0,
        royaltiesAmountPaid: '0',
        percentagePaid: 0,
    };

    if (!tokenTransfers || !transfers) {
        return stats;
    }

    for (const transferIndex of tokenTransfers) {
        const transfer = transfers[transferIndex];

        if (transfer.royaltyPayment && transfer.royaltyPayment.amount !== '0') {
            stats.royaltiesPaid += 1;
            stats.royaltiesAmountPaid = BigNumber.from(
                stats.royaltiesAmountPaid
            )
                .add(transfer.royaltyPayment.amount)
                .toString();
        } else {
            stats.royaltiesDodged += 1;
        }
    }

    stats.percentagePaid = Math.round(
        (stats.royaltiesPaid / tokenTransfers.length) * 100
    );

    return stats;
}
