import {
    describe,
    test,
    clearStore,
    beforeEach,
    afterEach
} from 'matchstick-as/assembly/index';
import { BigInt, Address } from '@graphprotocol/graph-ts';
import { handleTransfer, handleRoyalty } from '../src/royalty-erc721';
import {
    createTransferEvent,
    createRoyaltyPaymentEvent
} from './royalties_utils';
import {
    Transfer,
    RoyaltyPayment
} from '../src/types/RoyaltyToken/RoyaltyToken';

const CURRENCY = Address.fromString(
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
);
const GUY = Address.fromString('0x3155BA85D5F96b2d030a4966AF206230e46849cb');
const GAL = Address.fromString('0x760aB81a17d4183392c51cED1F16326016e202E7');
let BLOCK = BigInt.fromI32(1);
let transferEvent: Transfer;
let royaltyEvent: RoyaltyPayment;
describe('Scoped / Nested block', () => {
    beforeEach(() => {
        const from = Address.fromString(
            '0x0000000000000000000000000000000000000001'
        );
        const to = Address.fromString(
            '0x0000000000000000000000000000000000000001'
        );
        const id = BigInt.fromI32(12);
        transferEvent = createTransferEvent(from, to, id);
        handleTransfer(transferEvent);

        const amount = BigInt.fromI32(100);
        royaltyEvent = createRoyaltyPaymentEvent(
            from,
            to,
            CURRENCY,
            id,
            amount
        );

        handleRoyalty(royaltyEvent);
    });
    afterEach(() => {
        clearStore();
    });

    test('Single Transfer - Royalty paid', () => {
        transferEvent = createTransferEvent(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0x0000000000000000000000000000000000000002'),
            BigInt.fromI32(12)
        );
        handleTransfer(transferEvent);
    });
    test('Single Transfer - Royalty not paid', () => {
        transferEvent = createTransferEvent(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0x0000000000000000000000000000000000000002'),
            BigInt.fromI32(12)
        );
        handleTransfer(transferEvent);
    });
    test('Multiple Transfer - Royalty paid', () => {
        transferEvent = createTransferEvent(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0x0000000000000000000000000000000000000002'),
            BigInt.fromI32(12)
        );
        handleTransfer(transferEvent);
    });

    test('Multiple Transfer - Royalty Sometimes Paid', () => {
        transferEvent = createTransferEvent(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0x0000000000000000000000000000000000000002'),
            BigInt.fromI32(12)
        );
        handleTransfer(transferEvent);
    });

    test('Multiple Transfer - Royalty Sometimes Paid - Toggled', () => {
        transferEvent = createTransferEvent(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0x0000000000000000000000000000000000000002'),
            BigInt.fromI32(12)
        );
        handleTransfer(transferEvent);
    });
    test('Multiple Transfer - Royalty Sometimes Paid - Same', () => {
        transferEvent = createTransferEvent(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0x0000000000000000000000000000000000000002'),
            BigInt.fromI32(12)
        );
        handleTransfer(transferEvent);
    });

    test('Id transferred twice in same block - Royalty Piad', () => {
        transferEvent = createTransferEvent(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0x0000000000000000000000000000000000000002'),
            BigInt.fromI32(12)
        );
        handleTransfer(transferEvent);
    });

    test('Multiple Transfer', () => {
        transferEvent = createTransferEvent(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0x0000000000000000000000000000000000000002'),
            BigInt.fromI32(12)
        );
        handleTransfer(transferEvent);
        transferEvent = createTransferEvent(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0x0000000000000000000000000000000000000002'),
            BigInt.fromI32(14)
        );
        handleTransfer(transferEvent);
    });

    test('Multiple Transfer to Tokens', () => {
        transferEvent = createTransferEvent(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0xfBb4F87e5dB2DcB6b5991f38f964263E5BD31463'),
            BigInt.fromI32(12)
        );
        handleTransfer(transferEvent);
        transferEvent = createTransferEvent(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0xfBb4F87e5dB2DcB6b5991f38f964263E5BD31463'),
            BigInt.fromI32(14)
        );
        handleTransfer(transferEvent);
        /// check previos ownership
    });

    test('Multiple Transfer from Tokens', () => {
        transferEvent = createTransferEvent(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0xfBb4F87e5dB2DcB6b5991f38f964263E5BD31463'),
            BigInt.fromI32(12)
        );
        handleTransfer(transferEvent);
        transferEvent = createTransferEvent(
            Address.fromString('0x0000000000000000000000000000000000000001'),
            Address.fromString('0xfBb4F87e5dB2DcB6b5991f38f964263E5BD31463'),
            BigInt.fromI32(14)
        );
        handleTransfer(transferEvent);
        /// check previos ownership
        //
        transferEvent = createTransferEvent(
            Address.fromString('0xfBb4F87e5dB2DcB6b5991f38f964263E5BD31463'),
            Address.fromString('0x0000000000000000000000000000000000000001'),
            BigInt.fromI32(12)
        );
        handleTransfer(transferEvent);
        transferEvent = createTransferEvent(
            Address.fromString('0xfBb4F87e5dB2DcB6b5991f38f964263E5BD31463'),
            Address.fromString('0x0000000000000000000000000000000000000001'),
            BigInt.fromI32(14)
        );
        handleTransfer(transferEvent);
        /// check previos ownership deleted
        //
        // and is now owned by owner again
    });
});
