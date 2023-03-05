import { Container, Text, Textarea } from '@chakra-ui/react';
import { LensEnvironment, LensGatedSDK } from '@lens-protocol/sdk-gated';
import axios from 'axios';
import Avatar from 'boring-avatars';
import { ethers } from 'ethers';
import { useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useAccount } from 'wagmi';
import { MainContext } from '../contexts/MainContext';
import { useApolloClient, useToastErr } from '../hooks';
import { getSigner, lensHub, signCreatePostTypedData, splitSignature } from '../lens-api';

export function CreatePublication({ selectedOwners, setIsOpen }) {
    const addresses = selectedOwners.map(item => {
        const { address } = item;
        return {
            eoa: {
                address
            }
        };
    });
    const toastErr = useToastErr();
    const client = useApolloClient();
    const { profile } = useContext(MainContext);
    const { accessToken, handle, profileId } = profile;
    const { address } = useAccount();
    const [postData, setPostData] = useState('');

    let accessCondition = { and: { criteria: addresses } };

    async function createPost() {
        if (!postData) { return; };

        const {
            encryptedMetadata, contentURI
        } = await uploadToIPFS();

        let gated = {
            encryptedSymmetricKey: encryptedMetadata.encryptionParams.providerSpecificParams.encryptionKey,
            and: { criteria: addresses }
        };

        const createPostRequest = {
            profileId,
            contentURI: 'ipfs://' + contentURI,
            collectModule: {
                freeCollectModule: { followerOnly: true }
            },
            referenceModule: {
                followerOnlyReferenceModule: false
            },
            gated
        };

        const signedResult = await signCreatePostTypedData(createPostRequest, accessToken, client);
        const typedData = signedResult.result.typedData;
        const { v, r, s } = splitSignature(signedResult.signature);
        lensHub.postWithSig({
            profileId: typedData.value.profileId,
            contentURI: typedData.value.contentURI,
            collectModule: typedData.value.collectModule,
            collectModuleInitData: typedData.value.collectModuleInitData,
            referenceModule: typedData.value.referenceModule,
            referenceModuleInitData: typedData.value.referenceModuleInitData,
            sig: {
                v,
                r,
                s,
                deadline: typedData.value.deadline,
            },
        }).then(() => setIsOpen(false))
            .catch(err => {
                toastErr(err);
                setIsOpen(false);
            });
    }
    async function uploadToIPFS() {
        /* define the metadata */
        const metadata = {
            version: '2.0.0',
            content: postData,
            description: 'This is a gated post!',
            name: `Post by @${handle}`,
            external_url: `https://lenster.xyz/u/${handle}`,
            metadata_id: uuid(),
            mainContentFocus: 'TEXT_ONLY',
            attributes: [],
            locale: 'en-US',
        };

        /* create an instance of the Lens SDK gated content with the environment */
        const sdk = await LensGatedSDK.create({
            provider: new ethers.providers.Web3Provider(window.ethereum),
            signer: getSigner(),
            env: process.env.NEXT_PUBLIC_ENVIRONMENT || LensEnvironment.Mumbai
        });

        /* encrypt the metadata using the Lens SDK and upload it to IPFS */
        const { contentURI, encryptedMetadata } = await sdk.gated.encryptMetadata(
            metadata,
            profileId,
            {
                ...accessCondition
            },
            async function (EncryptedMetadata) {
                const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
                const added = await axios.post(url, JSON.stringify(EncryptedMetadata), {
                    headers: {
                        pinata_api_key: 'df035e83f7cf4a246496',
                        pinata_secret_api_key:
                            'aa5b83c6fcd53c6734c5dccf72820e350e1a62c5b7405fe589693ba2d5249aa4',
                    },
                }).catch(err => toastErr(err));
                return added.data.IpfsHash;
            }
        );

        /* return the metadata and contentURI to the caller */
        return {
            encryptedMetadata, contentURI
        };
    }

    function onChange(e) {
        setPostData(e.target.value);
    }

    return (
        <div>
            { /* once the user has authenticated, show the the main app */}
            {
                address && accessToken && (<Container
                    display='flex'
                    flexDirection='column'
                    maxWidth='100%'
                    margin='0'
                    padding='0 16px'
                >
                    <Textarea
                        onChange={onChange}
                        placeholder='Share the word!'
                        height='160px'
                        margin='32px 0'
                    />
                    <Container
                        display='flex'
                        maxWidth='100%'
                        margin='0'
                        padding='0'
                        justifyContent='space-between'
                    >
                        <Container
                            fontSize='11px'
                            color='#b3b3b3'
                            overflowY='scroll'
                            height='160px'
                            margin='0'
                            padding='0'
                        >
                            <Text
                                fontSize='16px'
                                fontWeight='bold'
                                color='white'
                                position='fixed'
                                background='black'
                                width='400px'
                                padding='16px 0'
                            >
                                Selected addresses
                            </Text>
                            {addresses.map((item, key) => {
                                const { address } = item.eoa;
                                return (
                                    <div key={key} className='flex items-center space-x-4' style={{ margin: '8px', width: '400px' }}>
                                        <Avatar name={address} size={16} variant='marble' />
                                        <div>{address}</div>
                                    </div>);
                            })}
                        </Container>
                        <button
                            onClick={createPost}
                            style={{
                                height: 'fit-content'
                            }}
                        >
                            Post
                        </button>
                    </Container>
                </Container >)
            }
        </div >
    );
}