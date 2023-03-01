import * as React from 'react';
import {
    EthereumClient, modalConnectors, walletConnectProvider
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { hardhat, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { globalCSS } from '../styles/globalCSS';
import { Layout } from '../components';

const theme = extendTheme(globalCSS);

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const alchemyMumbaiKey = process.env.NEXT_PUBLIC_ALCHEMY_MUMBAI_KEY;


const chains = [polygonMumbai, hardhat];

const providers = [
    alchemyProvider({ apiKey: alchemyMumbaiKey }),
    walletConnectProvider({ projectId }),
    publicProvider(),
    jsonRpcProvider({
        rpc: () => ({
            http: 'http://127.0.0.1:8545/'
        })
    })
];

const { provider, webSocketProvider } = configureChains(chains, providers);

const wagmiClient = createClient({
    autoConnect: true,
    connectors: modalConnectors({ appName: 'react-solidity-scaffold', chains }),
    provider,
    webSocketProvider
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

function App({ Component, pageProps }) {
    return (
        <ChakraProvider theme={theme}>
            <WagmiConfig client={wagmiClient}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </WagmiConfig>
            <Web3Modal
                projectId={projectId}
                ethereumClient={ethereumClient}
            />
        </ChakraProvider >
    );
}

export default App;