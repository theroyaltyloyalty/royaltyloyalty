import Modal from '../Modal';
import { Dispatch, SetStateAction } from 'react';

export default function WhitelistModal({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
    return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div>CreateWhitelist</div>
        </Modal>
    );
}
