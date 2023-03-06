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
    useMemo,
    useState,
    useEffect,
} from 'react';
import Head from 'next/head';
import infuraClient from 'services/infuraClient';
import { Asset, Collection } from 'types/infuraTypes';
import {
    OwnerData,
    OwnerExtended,
    Royalty,
    RoyaltyData,
    MerkleTreeData,
} from 'types/types';
import { shortenAddress } from 'utils/address';
import { convertToEth } from 'utils/currency';
import { generateMerkleTree } from 'utils/merkleTree';
import { MainContext } from '../../contexts/MainContext';
import { downloadCSV } from 'utils/csv';
import Avatar from 'components/Avatar';
import Filter from 'components/Filter';
import { loyaltyOptions } from 'utils/loyalty';
import { LoyaltyLevel } from 'types/types';

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
    const [merkleTreeData, setMerkleTreeData] = useState<MerkleTreeData | null>(
        null
    );

    const [loyaltyFilter, setLoyaltyFilter] = useState<LoyaltyLevel[]>([]);
    const filteredOwners = useMemo(() => {
        if (!loyaltyFilter.length) {
            return ownersExtended;
        }

        return ownersExtended.filter((owner) =>
            loyaltyFilter.includes(owner.loyaltyLevel)
        );
    }, [loyaltyFilter, ownersExtended]);

    // EFFECTS
    // Remove selected owners that are no longer in the filtered list
    useEffect(() => {
        if (!loyaltyFilter.length) {
            return;
        }

        setSelectedOwners((prevSelectedOwners) =>
            prevSelectedOwners.filter((owner) =>
                loyaltyFilter.includes(owner.loyaltyLevel)
            )
        );
    }, [loyaltyFilter]);

    // TABS
    const tabToComponent: {
        [key in PageTab]: JSX.Element;
    } = {
        [PageTab.Owners]: (
            <OwnersList
                owners={filteredOwners}
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
                            owners={filteredOwners}
                            selectedOwners={selectedOwners}
                            setIsWhitelistModalOpen={setIsWhitelistModalOpen}
                            setMerkleTreeData={setMerkleTreeData}
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
                        <div className="mb-2 flex items-center justify-between">
                            <Tabs
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                            <FilterActions
                                activeTab={activeTab}
                                loyaltyFilter={loyaltyFilter}
                                setLoyaltyFilter={setLoyaltyFilter}
                            />
                        </div>
                        <div>{tabToComponent[activeTab]}</div>
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
                    merkleTreeData={merkleTreeData}
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
        <div className="flex items-center space-x-4">
            {tabs.map((tab) => (
                <div
                    key={tab.value}
                    className={`cursor-pointer rounded-md border text-sm font-bold px-3 py-2 ${
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
    owners,
    selectedOwners,
    setMerkleTreeData,
    setIsWhitelistModalOpen,
    setIsPostModalOpen,
    profile,
}: {
    collection: Collection;
    owners: OwnerExtended[];
    selectedOwners: OwnerExtended[];
    setMerkleTreeData: Dispatch<SetStateAction<MerkleTreeData | null>>;
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
        const ownersToUse = selectedOwners.length ? selectedOwners : owners;
        const addresses = ownersToUse.map((owner) => owner.address);
        const merkleTree = generateMerkleTree(addresses);
        setMerkleTreeData({
            root: merkleTree.root,
            input: addresses,
        });
        setIsWhitelistModalOpen(true);
    }, [owners, selectedOwners, setIsWhitelistModalOpen, setMerkleTreeData]);

    const handleDownloadOwners = useCallback(() => {
        const ownersToUse = selectedOwners.length ? selectedOwners : owners;
        const ownersInput = ownersToUse.map((owner) => {
            const newOwner = { ...owner };
            delete newOwner.tokens;
            return newOwner;
        });

        downloadCSV(ownersInput, `collectors-${collection.name}`);
    }, [collection.name, owners, selectedOwners]);

    return (
        <div className="flex items-center space-x-4 text-sm font-bold">
            <button
                className="py-2 rounded-lg"
                onClick={handleMerkleTreeClick}
                disabled={!owners?.length}
            >
                Create whitelist
            </button>
            <button
                className="py-2 rounded-lg"
                disabled={!owners?.length}
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

const FilterActions = ({
    activeTab,
    setLoyaltyFilter,
    loyaltyFilter,
}: {
    activeTab: PageTab;
    loyaltyFilter: LoyaltyLevel[];
    setLoyaltyFilter: Dispatch<SetStateAction<LoyaltyLevel[]>>;
}) => {
    if (activeTab === PageTab.Owners) {
        return (
            <Filter
                label="Loyalty"
                selected={loyaltyFilter}
                onChange={(newSelected) => setLoyaltyFilter(newSelected)}
                options={loyaltyOptions.map((o) => ({
                    label: `${o.emoji} ${o.label}`,
                    value: o.level,
                }))}
            />
        );
    } else {
        return <></>;
    }
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
