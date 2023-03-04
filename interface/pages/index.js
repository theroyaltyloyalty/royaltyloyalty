import { gql } from '@apollo/client';
import {
    Button, Container, Heading, Menu, MenuButton, MenuItem, MenuList,
    Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr
} from '@chakra-ui/react';
import Head from 'next/head';
import * as React from 'react';
import { useContext, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { useAccount } from 'wagmi';
import { MainContext } from '../contexts/MainContext';
import { mutateFollowFee } from '../gqlQueries/mutateFollowFee';
import { useApolloClient, useIsMounted, useToastErr } from '../hooks';
import { dateFilter } from '../shared/constants';
import { formatWallet } from '../shared/utils';

function Home() {
    const isMounted = useIsMounted();
    const { isConnected } = useAccount();
    const toastErr = useToastErr();
    const [dateFilterIndex, setDateFilterIndex] = useState(1);
    const { profile } = useContext(MainContext);
    const client = useApolloClient();
    const { accessToken, profileId } = profile;

    function setFollowFee() {
        // TODO: frh -> if amount set display on table, also set currency option
        const address = '0x577eBC5De943e35cdf9ECb5BbE1f7D7CB6c7C647';
        // TODO: This is WMATIC, check if other tokens will work
        const currency = '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889';
        const value = 5;

        if (accessToken && profileId) {
            const _mutateFollowFee = gql`${mutateFollowFee(
                profileId, currency, value, address
            )}`;
            client.mutate({
                mutation: _mutateFollowFee,
                context: {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            })
                .then(res => {
                    console.log('res: ', res);
                })
                .catch(err => toastErr(err));
        }
    }

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
                        <Table variant='simple' size='sm'>
                            <Thead color='white'>
                                <Tr>
                                    <Th className='column-short'>Address</Th>
                                    <Th className='column-short'>NFTs Owned</Th>
                                    <Th className='column-short' >% royalties paid</Th>
                                    <Th className='column-short'>Total royalties paid</Th>
                                    <Th className='column-short'>Nº Royalties Dodged</Th>
                                    <Th className='column-short'>Nº Royalties Paid</Th>
                                    {profileId && <Th className='column-short'>Social</Th>}
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td className='column-short'>
                                        {formatWallet('0x75336b7F786dF5647f6B20Dc36eAb9E27D704894')}
                                    </Td>
                                    <Td className='column-short'>
                                        15
                                    </Td>
                                    <Td className='column-short'>
                                        70%
                                    </Td>
                                    <Td className='column-short'>
                                        $1,600
                                    </Td>
                                    <Td className='column-short'>
                                        3
                                    </Td>
                                    <Td className='column-short'>
                                        7
                                    </Td>
                                    {profileId && <Td className='column-short'>
                                        <Text
                                            background='#BCFE65'
                                            color='#00501E'
                                            border='none'
                                            borderRadius='4px'
                                            width='fit-content'
                                            padding='4px 8px'
                                            fontWeight='600'
                                            fontSize='14px'
                                            opacity='0.9'
                                            margin='0 auto'
                                        >
                                            Follows you
                                        </Text>
                                    </Td>}
                                </Tr>
                                <Tr>
                                    <Td className='column-short'>
                                        {formatWallet('0x577eBC5De943e35cdf9ECb5BbE1f7D7CB6c7C647')}
                                    </Td>
                                    <Td className='column-short'>
                                        15
                                    </Td>
                                    <Td className='column-short'>
                                        70%
                                    </Td>
                                    <Td className='column-short'>
                                        $1,600
                                    </Td>
                                    <Td className='column-short'>
                                        3
                                    </Td>
                                    <Td className='column-short'>
                                        7
                                    </Td>
                                    {profileId && <Td className='column-short'>
                                        <Button
                                            width='fit-content'
                                            padding='8px 16px'
                                            fontWeight='bold'
                                            margin='0 auto'
                                            onClick={() => setFollowFee()}
                                        >
                                            Set a follow fee
                                        </Button>
                                    </Td>}
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