import { useQuery } from '@tanstack/react-query';
import { Erc721__factory as Erc21Factory } from 'contracts';
import { BigNumber } from 'ethers';
import provider from 'services/provider';

export default function useRoyalties(tokenAddress: string) {
    return useQuery({
        queryKey: ['royalties', tokenAddress],
        queryFn: async () => {
            const contract = Erc21Factory.connect(tokenAddress, provider);
            const filter = contract.filters.RoyaltyPayment();
            const events = await contract.queryFilter(filter);

            let totalPaid = '0';
            const royaltyPayments = events.map((event) => {
                totalPaid = BigNumber.from(event.args.amount)
                    .add(totalPaid)
                    .toString();
                return {
                    operator: event.args.operator,
                    payer: event.args.payer,
                    currency: event.args.currency,
                    amount: event.args.amount.toString(),
                    tokenId: event.args.id.toString(),
                    transactionHash: event.transactionHash,
                    blockNumber: event.blockNumber,
                };
            });

            return {
                totalPaid,
                royaltyPayments,
            };
        },
    });
}
