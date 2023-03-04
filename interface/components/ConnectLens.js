import { Button, Container, Image, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { checkProfile } from '../gqlQueries/checkProfile';
import { useAccount } from 'wagmi';
import { useApolloClient, useToastErr } from '../hooks';

export function ConnectLens() {
    const { address, isConnected } = useAccount();
    const toastErr = useToastErr();
    const client = useApolloClient();
    const [profile, setProfile] = useState({});
    const { handle, ipfs } = profile;

    useEffect(() => {
        if (address && isConnected && !profile.handle) {
            const _checkProfile = gql`${checkProfile(address)}`;
            client.query({ query: _checkProfile })
                .then(res => {
                    const { items } = res.data.profiles;
                    if (items.length > 0) {
                        const { handle } = items[0];
                        const { url } = items[0].picture.original;
                        const ipfs = url.replace('ipfs://', '');
                        setProfile({ handle, ipfs });
                    }
                })
                .catch(err => toastErr(err));
        }
    }, [address, client, isConnected, profile.handle, toastErr]);

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
                    src={`https://user-content.lenster.xyz/300x300/https://gateway.ipfscdn.io/ipfs/${ipfs}`}
                    marginRight='4px'
                />
                <Text fontWeight='bold'>{handle}</Text>
            </Container>
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
        </Container>
    );
}