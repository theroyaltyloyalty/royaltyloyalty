import { gql } from '@apollo/client';
import { Button, Container, Image, Text } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';
import { MainContext } from '../contexts/MainContext';
import { checkProfile } from '../gqlQueries';
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
    mutation Authenticate($address: EthereumAddress!, $signature: Signature!) {
        authenticate(request: { address: $address, signature: $signature }) {
            accessToken
            refreshToken
        }
    }
`;

export function ConnectLens() {
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
            const _checkProfile = gql`
                ${checkProfile(address)}
            `;
            client
                .query({ query: _checkProfile })
                .then((res) => {
                    const { items } = res.data.profiles;
                    if (items.length > 0) {
                        const { handle, id } = items[0];
                        const { url } = items[0]?.picture?.original;
                        const ipfs = url.replace('ipfs://', '');
                        client
                            .query({
                                query: challenge,
                                variables: { address },
                            })
                            .then((res) => {
                                signer
                                    .signMessage(res.data.challenge.text)
                                    .then((signature) => {
                                        client
                                            .mutate({
                                                mutation: authenticate,
                                                variables: {
                                                    address,
                                                    signature,
                                                },
                                            })
                                            .then((res) => {
                                                const { accessToken } =
                                                    res.data.authenticate;
                                                setProfile({
                                                    accessToken,
                                                    profileId: id,
                                                    handle,
                                                    ipfs,
                                                });
                                            })
                                            .catch((err) =>
                                                toastErr(
                                                    err,
                                                    tries,
                                                    setCheckedProfile
                                                )
                                            );
                                    })
                                    .catch((err) =>
                                        toastErr(err, tries, setCheckedProfile)
                                    );
                            })
                            .catch((err) =>
                                toastErr(err, tries, setCheckedProfile)
                            );
                    }
                })
                .catch((err) => toastErr(err, tries, setCheckedProfile));
        }
    }, [
        address,
        checkedProfile,
        client,
        isConnected,
        profile.handle,
        setProfile,
        signer,
        toastErr,
    ]);

    return (
        <Container width="100%" textAlign="right">
            {profile.handle ? (
                <Container
                    background="#abfe2ccc"
                    color="#00501E"
                    border="none"
                    display="flex"
                    width="fit-content"
                    height="40px"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="lg"
                >
                    <Image
                        borderRadius="full"
                        width="32px"
                        height="32px"
                        alt={handle}
                        src={
                            ipfs.indexOf('https://cdn.stamp.fyi/avatar/') > -1
                                ? ipfs
                                : `https://user-content.lenster.xyz/300x300/https://gateway.ipfscdn.io/ipfs/${ipfs}`
                        }
                        marginRight="4px"
                    />
                    <Text fontWeight="bold">{handle}</Text>
                </Container>
            ) : (
                <Button
                    background="#abfe2ccc"
                    color="#00501e"
                    border="none"
                    height="40px"
                    onClick={() =>
                        window.open('https://claim.lens.xyz/', '_blank')
                    }
                >
                    Connect Lens 🌿
                </Button>
            )}
        </Container>
    );
}
