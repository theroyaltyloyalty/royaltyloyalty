import { gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { doesFollow } from '../gqlQueries';
import { useApolloClient, useToastErr } from '../hooks';

export function useCheckFollower(address, id) {
    const toastErr = useToastErr();
    const client = useApolloClient();

    return useQuery({
        queryKey: ['checkFollower', id, address],
        queryFn: async () => {

            if (!address || !id) {
                return null;
            }

            const _doesFollow = gql`${doesFollow(address, id)}`;
            const { data } = await client.query({ query: _doesFollow })
                .catch(err => toastErr(err));

            return data.doesFollow[0].follows;
        }
    });
}
