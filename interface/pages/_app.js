import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    EthereumClient,
    modalConnectors,
    walletConnectProvider
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import * as React from 'react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { goerli, hardhat, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import { Layout } from '../components';
import { polygonPocket } from '../shared/chains';
import '../styles/global.css';
import { globalCSS } from '../styles/globalCSS';

const theme = extendTheme(globalCSS);

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const alchemyMumbaiKey = process.env.NEXT_PUBLIC_ALCHEMY_MUMBAI_KEY;

const chains = [polygonPocket, polygonMumbai, goerli, hardhat];

const providers = [
    jsonRpcProvider({
        rpc: () => ({
            http: 'https://poly-mainnet.gateway.pokt.network/v1/lb/101f27bb3d7017b30ecc17e1',
        }),
    }),
    alchemyProvider({ apiKey: alchemyMumbaiKey }),
    walletConnectProvider({ projectId }),
    publicProvider(),
    jsonRpcProvider({
        rpc: () => ({
            http: 'http://127.0.0.1:8545/',
        }),
    }),
];

const { provider, webSocketProvider } = configureChains(chains, providers);

const wagmiClient = createClient({
    autoConnect: true,
    connectors: modalConnectors({ appName: 'royaltyloyalty', chains }),
    provider,
    webSocketProvider,
});

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

function App({ Component, pageProps }) {
    return (
        <>
            <ChakraProvider theme={theme}>
                <WagmiConfig client={wagmiClient}>
                    <QueryClientProvider client={queryClient}>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </QueryClientProvider>
                </WagmiConfig>
                <Web3Modal
                    projectId={projectId}
                    ethereumClient={ethereumClient}
                />
            </ChakraProvider>
        </>
    );
}

export default App;
