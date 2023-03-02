import Head from 'next/head';
import * as React from 'react';
import { useAccount } from 'wagmi';
import { Account, Connect } from '../components';
import { useIsMounted } from '../hooks';
import { Container, Heading } from '@chakra-ui/react';

function Home() {
    const isMounted = useIsMounted();
    const { isConnected } = useAccount();

    return (
        <div>
            <Head>
                <title>Holders</title>
                <meta name='description' content='Holders' />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <main>
                <Container display='flex' justifyContent='space-around' marginTop='16px' minWidth='600px'>
                    Holders page
                </Container>
            </main>
        </div>
    );
}

export default Home;