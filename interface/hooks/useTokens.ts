import { useQuery } from '@tanstack/react-query';
import infuraClient from 'services/infuraClient';
import { Token } from 'types/infuraTypes';

export default function useTokens(tokenAddress: string) {
    return useQuery({
        queryKey: ['tokens', tokenAddress],
        queryFn: async () => {
            const { data } = await infuraClient.get<Token>(
                `/nfts/${tokenAddress}/tokens`
            );
            return data;
        },
    });
}
