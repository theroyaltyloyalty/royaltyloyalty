import { CreatePublication } from '../../components';
import Modal from '../Modal';

export default function WhitelistModal({
    isOpen,
    setIsOpen,
    selectedOwners
}) {
    return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <CreatePublication selectedOwners={selectedOwners} setIsOpen={setIsOpen} />
        </Modal>
    );
}
