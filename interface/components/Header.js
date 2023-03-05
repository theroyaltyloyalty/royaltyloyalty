import { Connect, ConnectLens } from './index';
import { useAccount } from 'wagmi';
import { Link } from '@chakra-ui/react';

export function Header() {
    const { isConnected } = useAccount();

    return (
        <header className="h-20 border-b border-b-[#2F3137] flex items-center">
            <div className="container-content flex items-center justify-between">
                <Link href="/">
                    <div className="font-bold text-xl">Royalty Loyalty</div>
                </Link>
                <nav className="flex items-center">
                    {isConnected && <ConnectLens />}
                    <Connect />
                </nav>
            </div>
        </header>
    );
}
