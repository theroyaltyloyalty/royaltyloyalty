import { Web3Button } from '@web3modal/react';
import { Container } from '@chakra-ui/react';
import { useWeb3ModalTheme } from '@web3modal/react';

export function Connect() {
    const { theme, setTheme } = useWeb3ModalTheme();

    // Modal's theme object
    theme;

    // Set modal theme
    setTheme({
        themeMode: 'dark',
        themeColor: 'orange',
        themeBackground: 'gradient',
    });
    
    return (
        <Container width='100%' textAlign='right'>
            <Web3Button />
        </Container>
    );
}