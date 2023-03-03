import {
    Connect, Header
} from '../components';
import { useIsMounted } from '../hooks';
import { useAccount } from 'wagmi';

export function Layout({ children }) {
    const isMounted = useIsMounted();
    const { isConnected } = useAccount();

    return (
        <>
            {isMounted && <>
                <>
                    <Header />
                    {children}
                </>
            </>}
        </>
    );
}