import { OwnerExtended } from 'types/types';
import OwnerItem from './OwnerItem';
import { useContext, useMemo } from 'react';
import { MainContext } from '../../contexts/MainContext';

export default function OwnersList({
    owners,
}: {
    owners: OwnerExtended[];
}): JSX.Element {
    const { profile } = useContext(MainContext);
    const showFollowing = useMemo(() => Boolean(profile.profileId), [profile]);

    return (
        <table className="w-full table-auto ">
            <thead className="text-right">
                <tr className="h-12 uppercase text-xs">
                    <th className="text-left">Collector</th>
                    <th className="text-center">Loyalty</th>
                    {profile.profileId && (
                        <th className="text-center">Following</th>
                    )}
                    <th>Balance</th>
                    <th>Royalties Paid</th>
                    <th>Royalties Dodged</th>
                    <th>% Royalties Paid</th>
                    <th>Amount Paid</th>
                </tr>
            </thead>
            <tbody className="text-sm">
                {owners?.map((owner) => (
                    <OwnerItem
                        key={owner.address}
                        owner={owner}
                        showFollowing={showFollowing}
                    />
                ))}
            </tbody>
        </table>
    );
}
