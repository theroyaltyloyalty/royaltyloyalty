import { isAddress } from '@ethersproject/address';
import useOwners from 'hooks/useOwners';
import useRoyalties from 'hooks/useRoyalties';
import useTokens from 'hooks/useTokens';
import useTransfers from 'hooks/useTransfers';
import type { GetServerSideProps, NextPage } from 'next';
import { useContext } from 'react';
import infuraClient from 'services/infuraClient';
import { Collection } from 'types/infuraTypes';
import { shortenAddress } from 'utils/address';
import { Social } from '../../components';
import { MainContext } from '../../contexts/MainContext';

const addRoyaltyData = (transfers, royaltyData) => {
    const transfersWithRoyalty = {};

    transfers.forEach((transfer) => {
        const royalty = royaltyData.find(
            (royalty) => royalty.tokenId === transfer.tokenId
        );
        transfersWithRoyalty[transfer.tokenId] = {
            ...transfer,
            royalty,
        };
    });

    return transfersWithRoyalty;
};

const NftPage: NextPage = ({ collection }: { collection: Collection }) => {
    const { profile } = useContext(MainContext);
    const { profileId } = profile;
    const { data: tokens } = useTokens(collection.contract);
    const { data: owners } = useOwners(collection.contract);
    const { data: transfers } = useTransfers(collection.contract);
    const { data: royaltyData } = useRoyalties(collection.contract);

    const transfersWithRoyalty = {};
    const ownersTransfersData = {};

    // info we need
    // - % of royalties paid
    // - total royalties paid
    // - total royalties collected
    // - total royalties dodged
    // - total royalties collect

    //----------------
    // to convert:
    // transfer to royalty payment (obj)
    // owner to transfers (obj)
    // owner to transfer data (royalties data)

    // owners -> all transfers from owner. For each transfer, lookup royalty info

    return (
        <div className="py-12 space-y-8">
            <div className="container-content">
                <h1 className="font-bold text-4xl">{collection.name}</h1>
                <p>{shortenAddress(collection.contract)}</p>
            </div>
            <div className="container-content">
                <h2 className="font-bold text-lg">Collectors</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Address</th>
                            <th>Balance</th>
                            {profileId && <th className='column-short'>Social</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {owners?.map((owner) => (
                            <tr key={owner.address}>
                                <td>{shortenAddress(owner.address)}</td>
                                <td>{owner.balance}</td>
                                <td>
                                    <Social 
                                        address={owner.address}
                                        id={profileId}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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

    // todo: remove this
    return {
        props: {
            collection: {
                contract: tokenAddress,
                name: 'Test',
                symbol: 'TST',
                tokenType: 'ERC-721',
            },
        },
    };

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
