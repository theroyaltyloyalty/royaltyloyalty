import { OwnerData, TransferWithRoyalty } from 'types/types';
import OwnerItem from './OwnerItem';

export default function OwnersList({
    owners,
    ownersToTransfers,
    transfers,
}: {
    owners: OwnerData[];
    ownersToTransfers: Record<string, number[]>;
    transfers: TransferWithRoyalty[];
}): JSX.Element {
    return (
        <table className="w-full table-auto text-sm">
            <thead className="text-right">
                <tr>
                    <th></th>
                    <th className="text-left">Address</th>
                    <th>Balance</th>
                    <th>Royalties Paid</th>
                    <th>Royalties Dodged</th>
                    <th>% Royalties Paid</th>
                    <th>Royalties Amount Paid</th>
                    <th>Social</th>
                </tr>
            </thead>
            <tbody>
                {owners?.map((owner) => (
                    <OwnerItem
                        key={owner.address}
                        owner={owner}
                        ownerTransfers={ownersToTransfers[owner.address]}
                        transfers={transfers}
                    />
                ))}
            </tbody>
        </table>
    );
}
