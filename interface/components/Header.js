import {
    Container, Button, Tab, Tabs, TabList, TabPanels, TabPanel, Text
} from '@chakra-ui/react';
import { Connect } from './index';
import { FaCarrot } from 'react-icons/fa';
import { useRouter } from 'next/router';

export function Header() {
    const router = useRouter();

    function handleTabs(num) {
        num === 0 ? router.push('/') : router.push('/tokens');
    }

    return (
        <Container
            display='flex'
            justifyContent='space-between'
            minWidth='100vw'
            padding='16px 15vw'
            margin='0'
            borderBottom='2px solid #2d2d2d'
        >
            <Container
                display='flex'
                alignItems='center'
                fontWeight='bold'
                fontSize='28px'
            >
                <Text color='#C94E12' >Royalty</Text>
                <FaCarrot color='#933707' />
                <Text color='#C94E12'>Loyalty</Text>
            </Container>
            <Tabs
                width='100%'
                variant='soft-rounded'
                colorScheme='orange'
                onChange={(num) => handleTabs(num)}
            >
                <TabList>
                    <Tab>Holders</Tab>
                    <Tab>Tokens</Tab>
                </TabList>
            </Tabs>
            <Connect />
        </Container>
    );
}