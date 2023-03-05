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
    Dispatch,
    SetStateAction,
    useCallback,
    useContext,
    useState,
} from 'react';
import Head from 'next/head';
import infuraClient from 'services/infuraClient';
import { Asset, Collection } from 'types/infuraTypes';
import { OwnerData, OwnerExtended, Royalty, RoyaltyData } from 'types/types';
import { shortenAddress } from 'utils/address';
import { convertToEth } from 'utils/currency';
import { generateMerkleTree } from 'utils/merkleTree';
import { MainContext } from '../../contexts/MainContext';
import { downloadCSV } from 'utils/csv';
import Avatar from 'components/Avatar';

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
    const { data: royaltyData } = useRoyalties();
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
        <>
            <Head>
                <title>{collection.name}</title>
                <meta name="description" content={collection.name} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="py-12">
                <div className="container-content space-y-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Avatar
                                name={collection.contract}
                                size={64}
                                className="rounded-md"
                                square={true}
                            />
                            <div>
                                <h1 className="font-bold text-4xl mb-1">
                                    {collection.name}
                                </h1>
                                <p className="text-sm text-gray-200">
                                    {shortenAddress(collection.contract)}
                                </p>
                            </div>
                        </div>
                        <Actions
                            collection={collection}
                            selectedOwners={selectedOwners}
                            setIsWhitelistModalOpen={setIsWhitelistModalOpen}
                            setMerkleRoot={setMerkleRoot}
                            profile={profile}
                            setIsPostModalOpen={setIsPostModalOpen}
                        />
                    </div>
                    <Stats
                        owners={owners}
                        tokens={tokens}
                        royalty={royalty}
                        royaltyData={royaltyData}
                    />
                    <div>
                        <Tabs
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                        {tabToComponent[activeTab]}
                    </div>
                </div>
                {profile?.profileId && selectedOwners.length > 1 && (
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
        </>
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
        <div className="flex items-center space-x-4 mb-5">
            {tabs.map((tab) => (
                <div
                    key={tab.value}
                    className={`cursor-pointer rounded-md border text-sm font-bold  px-3 py-2 ${
                        activeTab === tab.value
                            ? 'text-black border-white bg-white'
                            : 'text-white border-gray-600'
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
                    <p className="text-xs uppercase font-bold text-gray-200">
                        {stat.label}
                    </p>
                    <p className="font-bold text-2xl">{stat.value}</p>
                </div>
            ))}
        </div>
    );
};

const Actions = ({
    collection,
    selectedOwners,
    setMerkleRoot,
    setIsWhitelistModalOpen,
    profile,
    setIsPostModalOpen,
}: {
    collection: Collection;
    selectedOwners: OwnerExtended[];
    setMerkleRoot: Dispatch<SetStateAction<string | null>>;
    setIsWhitelistModalOpen: Dispatch<SetStateAction<boolean>>;
    profile: {
        accessToken: any;
        handle: any;
        profileId: any;
        ipfs: any;
    };
    setIsPostModalOpen: Dispatch<SetStateAction<boolean>>;
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

    const handleDownloadOwners = useCallback(() => {
        if (!selectedOwners?.length) {
            return;
        }

        const ownersInput = selectedOwners.map((owner) => {
            const newOwner = { ...owner };
            delete newOwner.tokens;
            return newOwner;
        });

        downloadCSV(ownersInput, `collectors-${collection.name}`);
    }, [collection.name, selectedOwners]);

    return (
        <div className="flex items-center space-x-4 text-sm font-bold">
            <button
                className="py-2 rounded-lg"
                onClick={handleMerkleTreeClick}
                disabled={!selectedOwners?.length}
            >
                Create whitelist
            </button>
            <button
                className="py-2 rounded-lg"
                disabled={!selectedOwners?.length}
                onClick={handleDownloadOwners}
            >
                Download collectors
            </button>
            {profile?.profileId && selectedOwners.length > 1 && (
                <button
                    className="py-2 rounded-lg"
                    onClick={() => setIsPostModalOpen(true)}
                >
                    Post
                </button>
            )}
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
