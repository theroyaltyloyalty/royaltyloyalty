import { OwnerData, TransferWithRoyalty, OwnerExtended } from 'types/types';
import { useMemo } from 'react';
import { getOwnerRoyaltyStats } from 'utils/royalty';
import { getLoyalty } from 'utils/loyalty';
import useCheckFollowers from './useCheckFollowers';

export default function useOwnersExtended(
    owners?: OwnerData[],
    ownersToTransfers?: Record<string, number[]>,
    transfers?: TransferWithRoyalty[]
) {
    const followers = useCheckFollowers(
        owners?.map((owner) => owner.address) || []
    );

    const ownersExtended = useMemo(() => {
        if (!owners || !transfers || !ownersToTransfers) {
            return [];
        }

        return owners.map((owner) => {
            const royaltyStats = getOwnerRoyaltyStats(
                ownersToTransfers[owner.address],
                transfers
            );

            const loyalty = getLoyalty(royaltyStats.percentagePaid);
            const isFollower = followers?.[owner.address] || false;

            const ownerExtended: OwnerExtended = {
                ...owner,
                ...royaltyStats,
                isFollower,
                loyaltyLevel: loyalty.level,
            };

            return ownerExtended;
        });
    }, [owners, transfers, ownersToTransfers, followers]);

    return ownersExtended;
}
