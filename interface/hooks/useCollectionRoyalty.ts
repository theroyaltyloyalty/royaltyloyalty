import { useQuery } from '@tanstack/react-query';
import { Erc721__factory as Erc21Factory } from 'contracts';
import provider from 'services/provider';
import { bpsToPercent } from 'utils/number';

export default function useCollectionRoyalty(tokenAddress: string) {
    return useQuery({
        queryKey: ['collectionRoyalty', tokenAddress],
        queryFn: async () => {
            const contract = Erc21Factory.connect(tokenAddress, provider);
            const data = await contract.royaltyInfo(1, '10000');
            const royalty = data[1].toString();

            return {
                bps: parseInt(royalty),
                percent: bpsToPercent(royalty),
            };
        },
    });
}
