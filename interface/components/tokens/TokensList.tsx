import { Asset } from 'types/infuraTypes';
import { TransferWithRoyalty } from 'types/types';
import TokenItem from './TokenItem';

export default function TokensList({
    tokens,
    tokensToTransfers,
    transfers,
    ownerByTokenId,
}: {
    tokens: Asset[];
    tokensToTransfers: Record<string, number[]>;
    transfers: TransferWithRoyalty[];
    ownerByTokenId: Record<string, string>;
}) {
    return (
        <table className="w-full table-auto text-sm">
            <thead className="text-right">
                <tr className="h-12 uppercase text-xs">
                    <th></th>
                    <th className="text-left">Token</th>
                    <th className="text-left">Owner</th>
                    <th>Royalties Paid</th>
                    <th>Royalties Dodged</th>
                    <th>% Royalties Paid</th>
                    <th>Royalties Amount Paid</th>
                </tr>
            </thead>
            <tbody>
                {tokens?.map((token) => (
                    <TokenItem
                        key={token.tokenId}
                        token={token}
                        tokenTransfers={tokensToTransfers[token.tokenId]}
                        transfers={transfers}
                        owner={ownerByTokenId[token.tokenId]}
                    />
                ))}
            </tbody>
        </table>
    );
}
