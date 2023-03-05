import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';

const royaltyEvents = gql`${`
    query RoyaltyEvents {
            royaltyEvents{
                royaltyAmount
                blockNumber
                royaltyCurrency
                id
                tokenId
                operator
                payer
            }
    }
`}`;

export default function useRoyalties() {

    const client = new ApolloClient({
        uri: 'https://api.thegraph.com/subgraphs/name/stevennevins/royaltyloyalty',
        cache: new InMemoryCache()
    });

    return useQuery({
        queryKey: ['royalties', royaltyEvents],
        queryFn: async () => {
            let totalPaid = '0';

            const { data } = await client.query({
                query: royaltyEvents,
            });

            const royaltyPayments = data.royaltyEvents.map((event) => {
                totalPaid = BigNumber.from(event.royaltyAmount)
                    .add(totalPaid)
                    .toString();
                return {
                    ...event,
                    amount: event.royaltyAmount,
                    currency: event.royaltyCurrency,
                    transactionHash: event.id
                };
            });

            return { totalPaid, royaltyPayments, };
        },
    });
}
