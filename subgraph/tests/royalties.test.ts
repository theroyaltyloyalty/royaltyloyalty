import {
    describe,
    test,
    clearStore,
    beforeEach,
    afterEach,
} from 'matchstick-as/assembly/index';
import { BigInt, Address } from '@graphprotocol/graph-ts';
import { handleTransfer } from '../src/royalties-erc721';
import { createTransferEvent } from './royalties_utils';

describe('Scoped / Nested block', () => {
    beforeEach(() => {
        const from = Address.fromString(
            '0x0000000000000000000000000000000000000001'
        );
        const to = Address.fromString(
            '0x0000000000000000000000000000000000000001'
        );
        const id = BigInt.fromI32(12);
        const newTransferEvent = createTransferEvent(from, to, id);
        handleTransfer(newTransferEvent);
    });
    afterEach(() => {
        clearStore();
    });

    test('Single Transfer', () => {
        const newTransferEvent = createTransferEvent(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0x0000000000000000000000000000000000000002'),
            BigInt.fromI32(12)
        );
        handleTransfer(newTransferEvent);
    });

    test('Multiple Transfer', () => {
        const transfer1 = createTransferEvent(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0x0000000000000000000000000000000000000002'),
            BigInt.fromI32(12)
        );
        handleTransfer(transfer1);
        const transfer2 = createTransferEvent(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0x0000000000000000000000000000000000000002'),
            BigInt.fromI32(14)
        );
        handleTransfer(transfer2);
    });

    test('Multiple Transfer to Tokens', () => {
        const transfer1 = createTransferEvent(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0xfBb4F87e5dB2DcB6b5991f38f964263E5BD31463'),
            BigInt.fromI32(12)
        );
        handleTransfer(transfer1);
        const transfer2 = createTransferEvent(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0xfBb4F87e5dB2DcB6b5991f38f964263E5BD31463'),
            BigInt.fromI32(14)
        );
        handleTransfer(transfer2);
        /// check previos ownership
    });

    test('Multiple Transfer from Tokens', () => {
        const transfer1 = createTransferEvent(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0xfBb4F87e5dB2DcB6b5991f38f964263E5BD31463'),
            BigInt.fromI32(12)
        );
        handleTransfer(transfer1);
        const transfer2 = createTransferEvent(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0xfBb4F87e5dB2DcB6b5991f38f964263E5BD31463'),
            BigInt.fromI32(14)
        );
        handleTransfer(transfer2);
        /// check previos ownership
        //
        const transfer3 = createTransferEvent(
            Address.fromString('0xfBb4F87e5dB2DcB6b5991f38f964263E5BD31463'),
            Address.fromString('0x0000000000000000000000000000000000000001'),
            BigInt.fromI32(12)
        );
        handleTransfer(transfer3);
        const transfer4 = createTransferEvent(
            Address.fromString('0xfBb4F87e5dB2DcB6b5991f38f964263E5BD31463'),
            Address.fromString('0x0000000000000000000000000000000000000001'),
            BigInt.fromI32(14)
        );
        handleTransfer(transfer4);
        /// check previos ownership deleted
        //
        // and is now owned by owner again
    });
});
