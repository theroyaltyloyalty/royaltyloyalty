import useOwnerRoyaltyStats from 'hooks/useOwnerRoyaltyStats';
import { useContext } from 'react';
import { OwnerData, TransferWithRoyalty } from 'types/types';
import { shortenAddress } from 'utils/address';
import { convertToEth } from 'utils/currency';
import { MainContext } from '../../contexts/MainContext';
import { Social } from '../index';

export default function OwnerItem({
    owner,
    ownerTransfers,
    transfers,
}: {
    owner: OwnerData;
    ownerTransfers: number[];
    transfers: TransferWithRoyalty[];
}): JSX.Element {
    const { profile } = useContext(MainContext);
    const { profileId } = profile;
    const stats = useOwnerRoyaltyStats(ownerTransfers, transfers);

    return (
        <tr key={owner.address} className="text-right h-10">
            <td className="text-left min-w-[20px]">X</td>
            <td className="text-left">{shortenAddress(owner.address)}</td>
            <td>{owner.balance}</td>
            <td>{stats.royaltiesPaid}</td>
            <td>{stats.royaltiesDodged}</td>
            <td>{stats.percentagePaid}%</td>
            <td>{convertToEth(stats.royaltiesAmountPaid).formatted}</td>
            <td>
                <Social 
                    address={owner.address}
                    id={profileId}
                />
            </td>
        </tr>
    );
}
