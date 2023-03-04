import { useQuery } from '@tanstack/react-query';
import infuraClient from 'services/infuraClient';
import { Owner } from 'types/infuraTypes';
import { OwnerData } from 'types/types';

interface Response {
    cursor: string;
    network: string;
    total: number;
    pageNumber: number;
    pageSize: number;
    owners: Owner[];
}

const getAllOwners = async (tokenAddress: string) => {
    let keepFetching = true;
    let owners: Owner[] = [];
    let ownersFetched = 0;
    let cursor = '';

    while (keepFetching) {
        const { data } = await infuraClient.get<Response>(
            `/nfts/${tokenAddress}/owners?cursor=${cursor}`
        );

        owners = [...owners, ...data.owners];
        ownersFetched += data.pageSize;
        cursor = data.cursor;

        if (ownersFetched >= data.total) {
            keepFetching = false;
        }
    }

    return owners;
};

const getUniqueOwners = (owners: Owner[]) => {
    const ownersObj: {
        [address: string]: OwnerData;
    } = {};

    owners.forEach((owner) => {
        if (!ownersObj[owner.ownerOf]) {
            ownersObj[owner.ownerOf] = {
                address: owner.ownerOf,
                balance: parseInt(owner.amount),
                tokens: [owner.tokenId],
            };
        } else {
            ownersObj[owner.ownerOf].balance += parseInt(owner.amount);
            ownersObj[owner.ownerOf].tokens.push(owner.tokenId);
        }
    });

    return Object.values(ownersObj);
};

export default function useOwners(tokenAddress: string) {
    return useQuery({
        queryKey: ['owners', tokenAddress],
        queryFn: async () => {
            const allOwners = await getAllOwners(tokenAddress);
            const uniqueOwners = getUniqueOwners(allOwners);
            const sortedOwners = uniqueOwners.sort(
                (a, b) => b.balance - a.balance
            );

            return sortedOwners;
        },
    });
}
