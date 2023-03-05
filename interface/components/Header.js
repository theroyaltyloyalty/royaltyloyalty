import { Text } from '@chakra-ui/react';
import { FaCarrot } from 'react-icons/fa';
import { useAccount } from 'wagmi';
import { Connect, ConnectLens } from './index';
import Link from 'next/link';

export function Header() {
    const { isConnected } = useAccount();

    return (
        <header className="h-20 border-b border-b-[#2F3137] flex items-center">
            <div className="container-content flex items-center justify-between">
                <Link href="/">
                    <div className="flex items-center font-bold text-2xl">
                        <Text color="#C94E12">Royalty</Text>
                        <FaCarrot color="#933707" />
                        <Text color="#C94E12">Loyalty</Text>
                    </div>
                </Link>
                <nav className="flex items-center">
                    {isConnected && <ConnectLens />}
                    <Connect />
                </nav>
            </div>
        </header>
    );
}
