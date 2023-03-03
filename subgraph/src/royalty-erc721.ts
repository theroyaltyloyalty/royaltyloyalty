import { log, BigInt, Address } from '@graphprotocol/graph-ts';
import { Transfer } from './types/RoyaltyToken/RoyaltyToken';
import { TransferEvent } from './types/schema';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const CHECK_MATE = Address.fromString(
    '0xfBb4F87e5dB2DcB6b5991f38f964263E5BD31463'
);

export const BIGINT_ZERO = BigInt.fromI32(0);
export const BIGINT_ONE = BigInt.fromI32(1);
export const BIGINT_10K = BigInt.fromI32(10000);

let transferredId: BigInt; // Use WebAssembly global due to lack of closure support
export function handleTransfer(event: Transfer): void {
    transferredId = event.params.id;

    const transferEvent = new TransferEvent(
        event.transaction.hash.toHexString()
    );

    transferEvent.previousHolder = event.params.from.toHexString();
    transferEvent.newHolder = event.params.to.toHexString();
    transferEvent.blockNumber = event.block.number;
    transferEvent.blockTimestamp = event.block.timestamp;
    transferEvent.save();

    log.info('Log Event Block: {} Time: {} Id: {} from: {} to: {}', [
        event.block.number.toString(),
        event.block.timestamp.toString(),
        event.params.id.toString(),
        event.params.from.toHexString(),
        event.params.to.toHexString()
    ]);
}
