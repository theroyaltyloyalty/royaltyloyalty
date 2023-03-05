import { OwnerExtended } from 'types/types';
import { shortenAddress } from 'utils/address';
import { convertToEth } from 'utils/currency';
import Avatar from 'boring-avatars';
import { getLoyalty } from 'utils/loyalty';

export default function OwnerItem({
    owner,
    showFollowing,
}: {
    owner: OwnerExtended;
    showFollowing: boolean;
}): JSX.Element {
    const loyalty = getLoyalty(owner.percentagePaid);

    return (
        <tr key={owner.address} className="text-right h-12">
            <td>
                <div className="flex items-center space-x-4">
                    <Avatar name={owner.address} size={32} variant="marble" />
                    <div>{shortenAddress(owner.address)}</div>
                </div>
            </td>
            <td>
                <div className="flex items-center justify-center">
                    <div className="px-3 py-1 rounded-sm bg-white/5">{`${loyalty?.emoji} ${loyalty?.label}`}</div>
                </div>
            </td>
            {showFollowing && (
                <td>
                    <div className="flex items-center justify-center">
                        {owner.isFollower ? (
                            <div className="px-3 py-1 rounded-sm bg-white/5">
                                🌿 Follower
                            </div>
                        ) : (
                            '-'
                        )}
                    </div>
                </td>
            )}
            <td>{owner.balance}</td>
            <td>{owner.royaltiesPaid}</td>
            <td>{owner.royaltiesDodged}</td>
            <td>{owner.percentagePaid}%</td>
            <td>{convertToEth(owner.royaltiesAmountPaid).formatted}</td>
        </tr>
    );
}
