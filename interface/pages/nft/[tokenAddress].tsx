import { isAddress } from '@ethersproject/address';
import PostModal from 'components/modals/PostModal';
import WhitelistModal from 'components/modals/WhitelistModal';
import OwnersList from 'components/owners/OwnersList';
import TokensList from 'components/tokens/TokensList';
import useCollectionRoyalty from 'hooks/useCollectionRoyalty';
import useOwners from 'hooks/useOwners';
import { default as useOwnersExtended } from 'hooks/useOwnersExtended';
import useRoyalties from 'hooks/useRoyalties';
import useTokens from 'hooks/useTokens';
import useTransferMappings from 'hooks/useTransferMappings';
import useTransfers from 'hooks/useTransfers';
import useTransfersWithRoyalties from 'hooks/useTransfersWithRoyalties';
import type { GetServerSideProps, NextPage } from 'next';
import {
    useContext,
    useCallback,
    useState,
    Dispatch,
    SetStateAction,
} from 'react';
import infuraClient from 'services/infuraClient';
import { Asset, Collection } from 'types/infuraTypes';
import { OwnerData, OwnerExtended, Royalty, RoyaltyData } from 'types/types';
import { shortenAddress } from 'utils/address';
import { convertToEth } from 'utils/currency';
import { generateMerkleTree } from 'utils/merkleTree';
import { MainContext } from '../../contexts/MainContext';

export enum PageTab {
    Owners = 'Owners',
    Tokens = 'Tokens',
}

const NftPage: NextPage = ({ collection }: { collection: Collection }) => {
    // CONTEXT
    const { profile } = useContext(MainContext);

    // FETCH DATA
    const { data: tokens } = useTokens(collection.contract);
    const { data: ownersData } = useOwners(collection.contract);
    const { data: transfers } = useTransfers(collection.contract);
    const { data: royaltyData } = useRoyalties(collection.contract);
    const { data: royalty } = useCollectionRoyalty(collection.contract);

    const { owners, ownerByTokenId } = ownersData || {};
    const transfersWithRoyalty = useTransfersWithRoyalties(
        transfers,
        royaltyData
    );
    const { ownersToTransfers, tokensToTransfers } =
        useTransferMappings(transfersWithRoyalty);

    const ownersExtended = useOwnersExtended(
        owners,
        ownersToTransfers,
        transfersWithRoyalty
    );

    // STATE
    const [activeTab, setActiveTab] = useState(PageTab.Owners);
    const [isWhitelistModalOpen, setIsWhitelistModalOpen] = useState(false);
    const [selectedOwners, setSelectedOwners] = useState<OwnerExtended[]>([]);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [merkleRoot, setMerkleRoot] = useState<string | null>(null);

    // TABS
    const tabToComponent: {
        [key in PageTab]: JSX.Element;
    } = {
        [PageTab.Owners]: (
            <OwnersList
                owners={ownersExtended}
                selectedOwners={selectedOwners}
                setSelectedOwners={setSelectedOwners}
            />
        ),
        [PageTab.Tokens]: (
            <TokensList
                tokens={tokens}
                tokensToTransfers={tokensToTransfers}
                transfers={transfersWithRoyalty}
                ownerByTokenId={ownerByTokenId}
            />
        ),
    };

    return (
        <div className="py-12">
            <div className="container-content space-y-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-bold text-4xl">
                            {collection.name}
                        </h1>
                        <p>{shortenAddress(collection.contract)}</p>
                    </div>
                    <Actions
                        selectedOwners={selectedOwners}
                        setIsWhitelistModalOpen={setIsWhitelistModalOpen}
                        setMerkleRoot={setMerkleRoot}
                    />
                    {profile?.profileId && (
                        <button onClick={() => setIsPostModalOpen(true)}>
                            Post
                        </button>
                    )}
                </div>
                <Stats
                    owners={owners}
                    tokens={tokens}
                    royalty={royalty}
                    royaltyData={royaltyData}
                />
                <div>
                    <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                    {tabToComponent[activeTab]}
                </div>
            </div>
            {profile?.profileId && (
                <PostModal
                    isOpen={isPostModalOpen}
                    setIsOpen={setIsPostModalOpen}
                    selectedOwners={selectedOwners}
                />
            )}
            <WhitelistModal
                isOpen={isWhitelistModalOpen}
                setIsOpen={setIsWhitelistModalOpen}
                selectedOwners={selectedOwners}
                merkleRoot={merkleRoot}
            />
        </div>
    );
};

const Tabs = ({
    activeTab,
    setActiveTab,
}: {
    activeTab: PageTab;
    setActiveTab: (tab: PageTab) => void;
}) => {
    const tabs = [
        {
            label: 'Collectors',
            value: PageTab.Owners,
        },
        {
            label: 'Tokens',
            value: PageTab.Tokens,
        },
    ];

    return (
        <div className="flex items-center space-x-4 mb-4">
            {tabs.map((tab) => (
                <div
                    key={tab.value}
                    className={`cursor-pointer ${
                        activeTab === tab.value
                            ? 'text-primary-500'
                            : 'text-gray-500 hover:text-primary-500'
                    }`}
                    onClick={() => setActiveTab(tab.value)}
                >
                    {tab.label}
                </div>
            ))}
        </div>
    );
};

const Stats = ({
    owners,
    tokens,
    royalty,
    royaltyData,
}: {
    owners: OwnerData[];
    tokens: Asset[];
    royalty: Royalty;
    royaltyData: RoyaltyData;
}) => {
    const generalStats = [
        {
            label: 'Collectors',
            value: owners?.length || 0,
        },
        {
            label: 'Total Supply',
            value: tokens?.length || 0,
        },
        {
            label: 'Royalty',
            value: `${royalty?.percent || 0}%`,
        },
        {
            label: 'Royalties Received',
            value: convertToEth(royaltyData?.totalPaid || 0).formatted,
        },
    ];

    return (
        <div className="flex items-center space-x-10">
            {generalStats.map((stat) => (
                <div key={stat.label}>
                    <p className="text-xs uppercase">{stat.label}</p>
                    <p className="font-bold text-2xl">{stat.value}</p>
                </div>
            ))}
        </div>
    );
};

const Actions = ({
    selectedOwners,
    setMerkleRoot,
    setIsWhitelistModalOpen,
}: {
    selectedOwners: OwnerData[];
    setMerkleRoot: Dispatch<SetStateAction<string | null>>;
    setIsWhitelistModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const handleMerkleTreeClick = useCallback(() => {
        if (!selectedOwners?.length) {
            return;
        }
        const addresses = selectedOwners.map((owner) => owner.address);
        const merkleTree = generateMerkleTree(addresses);
        setMerkleRoot(merkleTree.root);
        setIsWhitelistModalOpen(true);
    }, [selectedOwners, setIsWhitelistModalOpen, setMerkleRoot]);

    return (
        <div className="flex items-center space-x-4">
            <button
                onClick={handleMerkleTreeClick}
                disabled={!selectedOwners?.length}
            >
                Create whitelist
            </button>
            <button>Download owners</button>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const tokenAddress = params.tokenAddress;
    if (typeof tokenAddress !== 'string' || !isAddress(tokenAddress)) {
        return {
            notFound: true,
        };
    }

    try {
        const { data } = await infuraClient.get<Collection>(
            `/nfts/${tokenAddress}`
        );

        return {
            props: {
                collection: data,
            },
        };
    } catch (error) {
        console.error(error);
        return {
            notFound: true,
        };
    }
};

export default NftPage;
