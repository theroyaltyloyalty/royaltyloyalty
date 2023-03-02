import { newMockEvent } from 'matchstick-as';
import { ethereum, BigInt, Address } from '@graphprotocol/graph-ts';
import { Transfer } from '../src/types/MockToken/MockToken';

export function createTransferEvent(
    from: Address,
    to: Address,
    id: BigInt
): Transfer {
    const transferEvent = changetype<Transfer>(newMockEvent());
    transferEvent.parameters = [
        new ethereum.EventParam('from', ethereum.Value.fromAddress(from)),
        new ethereum.EventParam('to', ethereum.Value.fromAddress(to)),
        new ethereum.EventParam(
            'tokenId',
            ethereum.Value.fromUnsignedBigInt(id)
        ),
    ];

    // const a = depositEvent.parameters[0].value.toAddress().toHexString();
    // const b = depositEvent.parameters[1].value.toAddress().toHexString();
    // const c = depositEvent.parameters[2].value.toBigInt().toString();
    // log.info('TEST {} {} {}', [a, b, c]);
    //
    return transferEvent;
}
