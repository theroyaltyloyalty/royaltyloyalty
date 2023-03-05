import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EthereumClient, modalConnectors } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { infuraProvider } from 'wagmi/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { Layout } from '../components';
import { MainContextProvider } from '../contexts/MainContext';
import { polygonPocket } from '../shared/chains';
import '../styles/global.css';
import { globalCSS } from '../styles/globalCSS';
import { INFURA_API_KEY, WALLET_CONNECT_PROJECT_ID } from '../config';
const theme = extendTheme(globalCSS);

const chains = [polygonMumbai, polygonPocket];
const providers = [
    infuraProvider({ apiKey: INFURA_API_KEY }),
    jsonRpcProvider({
        rpc: () => ({
            http: 'https://poly-mainnet.gateway.pokt.network/v1/lb/101f27bb3d7017b30ecc17e1',
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
                    <MainContextProvider>
                        <QueryClientProvider client={queryClient}>
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </QueryClientProvider>
                    </MainContextProvider>
                </WagmiConfig>
                <Web3Modal
                    projectId={WALLET_CONNECT_PROJECT_ID}
                    ethereumClient={ethereumClient}
                />
            </ChakraProvider>
        </>
    );
}

export default App;
