import { useQuery } from '@tanstack/react-query';
import infuraClient from 'services/infuraClient';
import { Token, Asset } from 'types/infuraTypes';

const getAllTokens = async (tokenAddress: string) => {
    let keepFetching = true;
    let tokens: Asset[] = [];
    let tokensFetched = 0;
    let cursor = '';

    while (keepFetching) {
        const { data } = await infuraClient.get<Token>(
            `/nfts/${tokenAddress}/tokens?cursor=${cursor}`
        );

        tokens = [...tokens, ...data.assets];
        tokensFetched += data.pageSize;
        cursor = data.cursor;

        if (tokensFetched >= data.total) {
            keepFetching = false;
        }
    }

    return tokens;
};

const sortTokens = (tokens: Asset[]) => {
    return tokens.sort((a, b) => {
        return parseInt(a.tokenId) - parseInt(b.tokenId);
    });
};

export default function useTokens(tokenAddress: string) {
    return useQuery({
        queryKey: ['tokens', tokenAddress],
        queryFn: async () => {
            const tokens = await getAllTokens(tokenAddress);
            const sortedTokens = sortTokens(tokens);
            return sortedTokens;
        },
    });
}
