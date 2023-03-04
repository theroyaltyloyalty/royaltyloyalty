import { useChainId } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import infuraClient from 'services/infuraClient';

export default function useHolders(tokenAddress: string) {
    const chainId = useChainId();

    return useQuery({
        queryKey: ['holders', tokenAddress],
        queryFn: () =>
            infuraClient.get(
                `/networks/${chainId}/nfts/${tokenAddress}/owners`
            ),
    });
}
