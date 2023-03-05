import Modal from '../Modal';
import { Dispatch, SetStateAction } from 'react';
import { OwnerExtended } from 'types/types';
import { RiFileCopyLine as IconCopy } from 'react-icons/ri';

export default function WhitelistModal({
    isOpen,
    setIsOpen,
    selectedOwners,
    merkleRoot,
}: {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    selectedOwners: OwnerExtended[];
    merkleRoot: string;
}) {
    return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div className="space-y-6">
                <h2 className="font-bold text-2xl">Create whitelist</h2>

                <div className="bg-white/5 rounded-md">
                    <div className="w-full px-4 py-3 border-b border-b-[#2F3137] flex items-center justify-between">
                        <div className="text-xs uppercase font-bold">
                            Merkle root
                        </div>
                        <div>copy</div>
                    </div>
                    <div className="p-4">{merkleRoot}</div>
                </div>

                <div className="bg-white/5 rounded-md">
                    <div className="w-full px-4 py-3 border-b border-b-[#2F3137] flex items-center justify-between">
                        <div className="text-xs uppercase font-bold">
                            Addresses
                        </div>
                        <div>Copy</div>
                    </div>
                    <div className="p-4 space-y-2">
                        {selectedOwners.map((owner) => {
                            return (
                                <div key={owner.address}>{owner.address}</div>
                            );
                        })}
                    </div>
                </div>

                <div></div>
            </div>
        </Modal>
    );
}
