import { LensEnvironment, LensGatedSDK } from '@lens-protocol/sdk-gated';
import axios from 'axios';
import { ethers } from 'ethers';
import { useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useAccount } from 'wagmi';
import { MainContext } from '../contexts/MainContext';
import { useApolloClient, useToastErr } from '../hooks';
import { getSigner, lensHub, signCreatePostTypedData, splitSignature } from '../lens-api';

export function CreatePublication() {
    const toastErr = useToastErr();
    const client = useApolloClient();
    const { profile } = useContext(MainContext);
    const { accessToken, handle, profileId } = profile;
    const { address } = useAccount();
    const [postData, setPostData] = useState('');


    const addresses = [
        {
            eoa: {
                address: '0x75336b7F786dF5647f6B20Dc36eAb9E27D704894'
            }
        },
        {
            eoa: {
                address: '0xdb46d1dc155634fbc732f92e853b10b288ad5a1d'
            }
        },
    ];

    let accessCondition = { and: { criteria: addresses } };

    async function createPost() {
        if (!postData) { return; };
        /* we first encrypt and upload the data to IPFS */
        const {
            encryptedMetadata, contentURI
        } = await uploadToIPFS();

        let gated = {
            encryptedSymmetricKey: encryptedMetadata.encryptionParams.providerSpecificParams.encryptionKey,
            and: { criteria: addresses }
        };

        /* configure the final post data containing the content URI and the gated configuration */
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
        try {
            /* this code creates a typed data request (using the createPostRequest object) and sends the transaction to the network */
            const signedResult = await signCreatePostTypedData(createPostRequest, accessToken, client);
            const typedData = signedResult.result.typedData;
            const { v, r, s } = splitSignature(signedResult.signature);
            const tx = await lensHub.postWithSig({
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
            });
        } catch (err) {
        }
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
                address && accessToken && (
                    <div>
                        <textarea
                            onChange={onChange}
                            placeholder="Encrypted post content"
                        />
                        <button onClick={createPost}>Submit</button>
                    </div>
                )
            }
        </div>
    );
}