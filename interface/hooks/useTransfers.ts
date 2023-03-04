import { useQuery } from '@tanstack/react-query';
import infuraClient from 'services/infuraClient';
import { Transfer } from 'types/infuraTypes';
import { RoyaltyPayment, TransferWithRoyalty } from 'types/types';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

interface Response {
    total: number;
    pageNumber: number;
    pageSize: number;
    cursor?: string;
    network: string;
    account: string;
    transfers: Transfer[];
}

const getAllTransfers = async (tokenAddress: string) => {
    let keepFetching = true;
    let transfers: Transfer[] = [];
    let transfersFetched = 0;
    let cursor = '';

    while (keepFetching) {
        const { data } = await infuraClient.get<Response>(
            `/nfts/${tokenAddress}/transfers?cursor=${cursor}`
        );

        const filteredTransfers = data.transfers.filter(
            (transfer) =>
                transfer.fromAddress !== ZERO_ADDRESS &&
                transfer.toAddress !== ZERO_ADDRESS
        );

        transfers = [...data.transfers, ...filteredTransfers];
        transfersFetched += data.pageSize;
        cursor = data.cursor;

        if (transfersFetched >= data.total) {
            keepFetching = false;
        }
    }

    return transfers;
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

const aggregateTransfersByTokenId = (transfers: TransferWithRoyalty[]) => {
    const transfersByTokenId: Record<string, TransferWithRoyalty[]> = {};

    transfers.forEach((transfer) => {
        if (!transfersByTokenId[transfer.tokenId]) {
            transfersByTokenId[transfer.tokenId] = [];
        }

        transfersByTokenId[transfer.tokenId].push(transfer);
    });

    return transfersByTokenId;
};

export default function useTransfers(tokenAddress: string) {
    return useQuery({
        queryKey: ['transactions', tokenAddress],
        queryFn: async () => {
            const transfers = await getAllTransfers(tokenAddress);
            return transfers;
        },
    });
}
