import { useWeb3Modal } from '@web3modal/react';
import { Button } from '@chakra-ui/react';
import { useState } from 'react';

export function Connect() {
    const [loading, setLoading] = useState(false);
    const { open } = useWeb3Modal();

    async function onOpen() {
        setLoading(true);
        await open();
        setLoading(false);
    }

    return (
        <Button onClick={onOpen} disabled={loading} borderRadius='full'>
            Connect your wallet
        </Button >
    );
}