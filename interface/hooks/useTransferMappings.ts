import { TransferWithRoyalty } from 'types/types';

export default function useTransferMappings(
    transfersWithRoyalty: TransferWithRoyalty[]
) {
    const tokensToTransfers: Record<string, number[]> = {};
    const ownersToTransfers: Record<string, number[]> = {};

    for (let i = 0; i < transfersWithRoyalty?.length; i++) {
        const transfer = transfersWithRoyalty[i];
        const { toAddress, tokenId } = transfer;
        if (!tokensToTransfers[tokenId]) {
            tokensToTransfers[tokenId] = [i];
        } else {
            tokensToTransfers[tokenId].push(i);
        }

        if (!ownersToTransfers[toAddress]) {
            ownersToTransfers[toAddress] = [i];
        } else {
            ownersToTransfers[toAddress].push(i);
        }
    }

    return { tokensToTransfers, ownersToTransfers };
}
