import Modal from '../Modal';
import { Dispatch, SetStateAction, useState } from 'react';
import { OwnerExtended } from 'types/types';
import { RiFileCopyLine as IconCopy } from 'react-icons/ri';
import Copy from 'components/Copy';

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

                <ResultArea title="Merkle root" value={merkleRoot} />
                <ResultArea
                    title="Addresses"
                    value={selectedOwners.map((owner) => owner.address)}
                />
            </div>
        </Modal>
    );
}

const ResultArea = ({
    title,
    value,
}: {
    title: string;
    value: string | string[];
}) => {
    const [isCopied, setIsCopied] = useState(false);

    return (
        <div className="bg-white/5 rounded-md py-5">
            <div className="w-full px-5 pb-4 flex text-gray-400 items-center justify-between">
                <div className="text-xs uppercase font-bold">{title}</div>
                <div className="text-xs cursor-pointer">
                    <Copy
                        text={
                            typeof value === 'string' ? value : value.join('\n')
                        }
                        onCopy={() => setIsCopied(true)}
                    >
                        {isCopied ? (
                            'Copied!'
                        ) : (
                            <div className="flex items-center">
                                <IconCopy className="mr-1 h-4 w-4" />
                                <span>Copy</span>
                            </div>
                        )}
                    </Copy>
                </div>
            </div>
            <div className="px-5 text-sm space-y-2">
                {typeof value === 'string'
                    ? value
                    : value.map((v) => <div key={v}>{v}</div>)}
            </div>
        </div>
    );
};
