import { newMockEvent } from 'matchstick-as';
import { ethereum, BigInt, Address } from '@graphprotocol/graph-ts';
import {
    Transfer,
    RoyaltyPayment
} from '../src/types/RoyaltyToken/RoyaltyToken';

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
        )
    ];

    return transferEvent;
}
export function createRoyaltyPaymentEvent(
    operator: Address,
    payer: Address,
    currency: Address,
    id: BigInt,
    amount: BigInt
): RoyaltyPayment {
    const royaltyPayment = changetype<RoyaltyPayment>(newMockEvent());
    royaltyPayment.parameters = [
        new ethereum.EventParam(
            'operator',
            ethereum.Value.fromAddress(operator)
        ),
        new ethereum.EventParam('payer', ethereum.Value.fromAddress(payer)),
        new ethereum.EventParam(
            'currency',
            ethereum.Value.fromAddress(currency)
        ),
        new ethereum.EventParam('id', ethereum.Value.fromUnsignedBigInt(id)),
        new ethereum.EventParam(
            'amount',
            ethereum.Value.fromUnsignedBigInt(amount)
        )
    ];

    return royaltyPayment;
}
