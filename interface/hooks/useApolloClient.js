import { ApolloClient, InMemoryCache } from '@apollo/client';
import { useProvider } from 'wagmi';

export function useApolloClient() {
    const provider = useProvider();
    const { chainId } = provider._network;

    const API_URL = chainId === 137
        ? 'https://api.lens.dev'
        : 'https://api-mumbai.lens.dev/';

    return new ApolloClient({
        uri: API_URL,
        cache: new InMemoryCache()
    });
}