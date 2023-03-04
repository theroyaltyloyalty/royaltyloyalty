import { useQuery } from '@tanstack/react-query';
import infuraClient from 'services/infuraClient';
import { useChainId } from 'wagmi';

export default function useHolders(tokenAddress: string) {
    const chainId = useChainId();

    return useQuery({
        queryKey: ['holders', tokenAddress],
        queryFn: () =>
            infuraClient.get(`/networks/${chainId}/nfts/${tokenAddress}owners`),
    });
}
