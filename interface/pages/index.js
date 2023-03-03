import Head from 'next/head';
import * as React from 'react';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useIsMounted } from '../hooks';
import {
    Container, Heading, Table, Tbody, TableContainer, Text, Td, Thead,
    Th, Tr, Button, Menu, MenuButton, MenuList, MenuItem
} from '@chakra-ui/react';
import { formatWallet } from '../shared/utils';
import { dateFilter } from '../shared/constants';
import { BsChevronDown } from 'react-icons/bs';

function Home() {
    const isMounted = useIsMounted();
    const { isConnected } = useAccount();
    const [dateFilterIndex, setDateFilterIndex] = useState(1);

    return (
        <div>
            <Head>
                <title>Holders</title>
                <meta name='description' content='Holders' />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <main>
                <Container
                    minWidth='70vw'
                    padding='0'
                >
                    <Heading fontSize='2xl' margin='32px auto 32px 24px'>
                        Creator royalties resume
                    </Heading>
                    <Container
                        display='flex'
                        justifyContent='space-between'
                        minWidth='100%'
                        margin='0'
                    >
                        <Container padding='0'>
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    variant='outline'
                                    border='1px solid #2d2d2d !important'
                                    rightIcon={<BsChevronDown />}
                                    minWidth='170px'
                                    textAlign='left'
                                >
                                    {dateFilter[dateFilterIndex].text}
                                </MenuButton>
                                <MenuList
                                    background='#191919'
                                    padding='0'
                                    border='none'
                                    outline='none'
                                    zIndex='2'
                                >
                                    {dateFilter.map((item, key) => {
                                        const { text } = item;
                                        return (
                                            <MenuItem
                                                display='flex'
                                                key={key}
                                                onClick={() => setDateFilterIndex(key)}
                                                padding='12px'
                                                fontWeight='normal'
                                                sx={{
                                                    ':active, :focus': { background: '#191919' },
                                                    ':hover': { background: '#282828' },
                                                }}>
                                                {text}
                                            </MenuItem>
                                        );
                                    })}
                                </MenuList>
                            </Menu>
                        </Container>
                        <Container display='flex' justifyContent='end'>
                            <Button>
                                Merkle root
                            </Button>
                            <Button marginLeft='16px'>
                                Export
                            </Button>
                        </Container>
                    </Container>
                    <TableContainer>
                        <Table variant='simple'>
                            <Thead color='white'>
                                <Tr>
                                    <Th>Address</Th>
                                    <Th>NFTs Owned</Th>
                                    <Th>% royalties paid</Th>
                                    <Th>Total royalties paid</Th>
                                    <Th>Nº Royalties Dodged</Th>
                                    <Th>Nº Royalties Paid</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>
                                        {formatWallet('0x75336b7F786dF5647f6B20Dc36eAb9E27D704894')}
                                    </Td>
                                    <Td>
                                        15
                                    </Td>
                                    <Td>
                                        70%
                                    </Td>
                                    <Td>
                                        $1,600
                                    </Td>
                                    <Td>
                                        3
                                    </Td>
                                    <Td>
                                        7
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Container>
            </main>
        </div>
    );
}

export default Home;