import Modal from '../Modal';
import { Dispatch, SetStateAction } from 'react';
import { OwnerExtended } from 'types/types';

export default function WhitelistModal({
    isOpen,
    setIsOpen,
    selectedOwners,
}: {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    selectedOwners: OwnerExtended[];
}) {
    return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div>CreateWhitelist</div>
            <div>
                {selectedOwners.map((owner) => {
                    return <div key={owner.address}>{owner.address}</div>;
                })}
            </div>
        </Modal>
    );
}
