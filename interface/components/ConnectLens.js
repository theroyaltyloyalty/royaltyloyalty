import { gql } from '@apollo/client';
import { Button, Container, Image, Text } from '@chakra-ui/react';
import { ethers, utils } from 'ethers';
import omitDeep from 'omit-deep';
import { useContext, useEffect, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';
import LENS_HUB_ABI from '../abi/lens-hub-contract-abi.json';
import { MainContext } from '../contexts/MainContext';
import { checkProfile, revertFollowModule } from '../gqlQueries';
import { useApolloClient, useToastErr } from '../hooks';
import { fetched } from '../shared/constants';

const challenge = gql`
  query Challenge($address: EthereumAddress!) {
    challenge(request: { address: $address }) {
      text
    }
  }
`;

const authenticate = gql`
  mutation Authenticate(
    $address: EthereumAddress!
    $signature: Signature!
  ) {
    authenticate(request: {
      address: $address,
      signature: $signature
    }) {
      accessToken
      refreshToken
    }
  }
  `;

export function ConnectLens() {
    const LENS_HUB_CONTRACT = process.env.NEXT_PUBLIC_LENS_HUB_CONTRACT;
    const { address, isConnected } = useAccount();
    const { data: signer } = useSigner();
    const toastErr = useToastErr();
    const client = useApolloClient();
    const [checkedProfile, setCheckedProfile] = useState(fetched);
    const { profile, setProfile } = useContext(MainContext);
    const { handle, ipfs } = profile;

    useEffect(() => {
        const { fetched, tries } = checkedProfile;
        if (address && isConnected && signer && !fetched) {
            setCheckedProfile({ fetched: true, tries: 0 });
            const _checkProfile = gql`${checkProfile(address)}`;
            client.query({ query: _checkProfile })
                .then(res => {
                    const { items } = res.data.profiles;
                    if (items.length > 0) {
                        const { handle, id, followModule } = items[0];
                        const { url } = items[0].picture.original;
                        const ipfs = url.replace('ipfs://', '');
                        client.query({
                            query: challenge,
                            variables: { address }
                        }).then(res => {
                            signer.signMessage(res.data.challenge.text)
                                .then(signature => {
                                    client.mutate({
                                        mutation: authenticate,
                                        variables: {
                                            address, signature
                                        }
                                    }).then(res => {
                                        const { accessToken } = res.data.authenticate;

                                        if (!followModule) {
                                            const _revertFollowModule = gql`${revertFollowModule(id)}`;
                                            client.mutate({
                                                mutation: _revertFollowModule,
                                                context: {
                                                    headers: {
                                                        Authorization: `Bearer ${accessToken}`
                                                    }
                                                }
                                            }).then(res => {
                                                const { domain, types, value } =
                                                    res.data.createSetFollowModuleTypedData.typedData;

                                                signer._signTypedData(
                                                    omitDeep(domain, '__typename'),
                                                    omitDeep(types, '__typename'),
                                                    omitDeep(value, '__typename')
                                                ).then((signature) => {
                                                    const { v, r, s } = utils.splitSignature(signature);

                                                    const lensHub = new ethers.Contract(
                                                        LENS_HUB_CONTRACT,
                                                        LENS_HUB_ABI,
                                                        signer
                                                    );

                                                    lensHub.setFollowModuleWithSig({
                                                        profileId: value.profileId,
                                                        followModule: value.followModule,
                                                        followModuleInitData: value.followModuleInitData,
                                                        sig: {
                                                            v,
                                                            r,
                                                            s,
                                                            deadline: value.deadline,
                                                        },
                                                    })
                                                        .catch(err => toastErr(err, tries, setCheckedProfile));

                                                }).catch(err => toastErr(err, tries, setCheckedProfile));

                                            }).catch(err => toastErr(err, tries, setCheckedProfile));

                                        }

                                        setProfile({
                                            accessToken,
                                            profileId: id,
                                            handle,
                                            ipfs
                                        });
                                    }).catch(err => toastErr(err, tries, setCheckedProfile));
                                }).catch(err => toastErr(err, tries, setCheckedProfile));
                        }).catch(err => toastErr(err, tries, setCheckedProfile));
                    }
                })
                .catch(err => toastErr(err, tries, setCheckedProfile));
        }
    }, [
        address, checkedProfile, client, isConnected, profile.handle,
        setProfile, signer, toastErr, LENS_HUB_CONTRACT
    ]);

    return (
        <Container width='100%' textAlign='right'>
            {profile.handle ? <Container
                background='#BCFE65'
                color='#00501E'
                border='none'
                display='flex'
                width='fit-content'
                padding='8px 16px'
                alignItems='center'
                justifyContent='center'
                borderRadius='full'
            >
                <Image
                    borderRadius='full'
                    width='32px'
                    height='32px'
                    alt={handle}
                    src={ipfs.indexOf('https://cdn.stamp.fyi/avatar/') > -1
                        ? ipfs
                        : `https://user-content.lenster.xyz/300x300/https://gateway.ipfscdn.io/ipfs/${ipfs}`
                    }
                    marginRight='4px'
                />
                <Text fontWeight='bold'>{handle}</Text>
            </Container >
                : <Button
                    background='#BCFE65'
                    color='#00501E'
                    border='none'
                    height='42px'
                    onClick={() => window.open('https://claim.lens.xyz/', '_blank')}
                >
                    Create Lens Profile
                </Button>

            }
        </Container >
    );
}