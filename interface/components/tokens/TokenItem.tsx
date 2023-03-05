/* eslint-disable @next/next/no-img-element */
import { Asset } from 'types/infuraTypes';
import { TransferWithRoyalty } from 'types/types';
import useTokenRoyaltyStats from 'hooks/useTokenRoyaltyStats';
import { convertToEth } from 'utils/currency';
import { shortenAddress } from 'utils/address';
import Image from 'next/image';

export default function TokenItem({
    token,
    owner,
    tokenTransfers,
    transfers,
}: {
    token: Asset;
    owner: string;
    tokenTransfers: number[];
    transfers: TransferWithRoyalty[];
}) {
    const stats = useTokenRoyaltyStats(tokenTransfers, transfers);

    return (
        <tr key={token.tokenId} className="text-right h-12">
            <td className="min-w-[20px]">
                <div className="flex items-center select-none">
                    <img
                        src={token.metadata?.image}
                        alt={token.metadata?.name || ''}
                        width={32}
                        height={32}
                    />
                </div>
            </td>
            <td className="text-left">#{parseInt(token.tokenId) + 1}</td>
            <td className="text-left">{shortenAddress(owner)}</td>
            <td>{stats.royaltiesPaid}</td>
            <td>{stats.royaltiesDodged}</td>
            <td>{stats.percentagePaid}%</td>
            <td>{convertToEth(stats.royaltiesAmountPaid).formatted}</td>
        </tr>
    );
}
