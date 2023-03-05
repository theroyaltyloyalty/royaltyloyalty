import { useWeb3ModalTheme, Web3Button } from '@web3modal/react';

export function Connect() {
    const { setTheme } = useWeb3ModalTheme();

    // Set modal theme
    setTheme({
        themeMode: 'dark',
        themeColor: 'orange',
        themeBackground: 'gradient',
    });

    return <Web3Button />;
}
