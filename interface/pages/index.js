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
                <title>React Solidity Scaffold</title>
                <meta name="description" content="Scaffold to start a web3 project with solidity, javascript and React on the frontend" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <Container display='flex' justifyContent='space-around' marginTop='16px' minWidth='600px'>
                </Container>
            </main>
        </div>
    );
}

export default Home;