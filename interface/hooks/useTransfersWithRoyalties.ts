import { Transfer } from 'types/infuraTypes';
import { RoyaltyPayment, TransferWithRoyalty, RoyaltyData } from 'types/types';
import { useMemo } from 'react';

const formatRoyalties = (royaltyPayments: RoyaltyPayment[]) => {
    const formatted: Record<string, RoyaltyPayment> = {};

    royaltyPayments.forEach((payment) => {
        const key = `${payment.tokenId}-${payment.transactionHash}`;
        formatted[key] = payment;
    });

    return formatted;
};

const addRoyaltiesToTransfers = (
    transfers: Transfer[],
    royalties: Record<string, RoyaltyPayment>
) => {
    const transfersWithRoyalties: TransferWithRoyalty[] = transfers.map(
        (transfer) => {
            const key = `${transfer.tokenId}-${transfer.transactionHash}`;
            const royaltyPayment = royalties[key] || null;

            return {
                ...transfer,
                royaltyPayment,
            };
        }
    );

    return transfersWithRoyalties;
};

export default function useTransfersWithRoyalties(
    transfers: Transfer[],
    royaltyData: RoyaltyData
) {
    return useMemo(() => {
        if (!transfers || !royaltyData) {
            return null;
        }

        const formattedRoyalties = formatRoyalties(royaltyData.royaltyPayments);
        const transfersWithRoyalties = addRoyaltiesToTransfers(
            transfers,
            formattedRoyalties
        );

        return transfersWithRoyalties;
    }, [transfers, royaltyData]);
}
