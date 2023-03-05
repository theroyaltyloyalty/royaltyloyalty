import { gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { MainContext } from '../contexts/MainContext';
import { doesFollow } from '../gqlQueries';
import { useApolloClient } from './useApolloClient';

export default function useAreFollowers(addresses: string[]) {
    const { profile } = useContext(MainContext);
    const client = useApolloClient();

    const { data: followers } = useQuery(
        ['followers', profile?.profileId, addresses],
        async () => {
            if (!profile.profileId || !addresses.length) {
                return {};
            }
            const promises = addresses.map((address) => {
                return client.query({
                    query: gql`
                        ${doesFollow(address, profile.profileId)}
                    `,
                });
            });

            const results = await Promise.all(promises);

            const followers: Record<string, boolean> = {};

            for (const result of results) {
                const data = result.data?.doesFollow?.[0];
                const address = data?.followerAddress;
                const isFollower = data?.follows;

                if (address) {
                    followers[address.toLowerCase()] = isFollower;
                }
            }

            return followers;
        }
    );

    return followers;
}
