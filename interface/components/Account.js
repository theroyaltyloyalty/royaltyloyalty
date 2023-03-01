import { Button, Text } from '@chakra-ui/react';
import { useDisconnect } from 'wagmi';
import { useAccount } from 'wagmi';

export function Account() {
    const { disconnect } = useDisconnect();
    const { address } = useAccount();

    return (<>
        <Text padding='10px'> Welcome {address} </Text>
        <Button onClick={() => disconnect()}> Logout </Button>
    </>
    );
}