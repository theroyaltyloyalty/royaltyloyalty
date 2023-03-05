import { useQuery } from '@tanstack/react-query';
import infuraClient from 'services/infuraClient';
import { Transfer } from 'types/infuraTypes';

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

        transfers = [...transfers, ...filteredTransfers];
        transfersFetched += data.pageSize;
        cursor = data.cursor;

        if (transfersFetched >= data.total || !cursor) {
            keepFetching = false;
        }
    }

    return transfers;
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
