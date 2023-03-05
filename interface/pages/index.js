import { Box, Container, Heading } from '@chakra-ui/react';
import Avatar from 'boring-avatars';
import Head from 'next/head';
import Link from 'next/link';
import * as React from 'react';
import useUserCollections from '../hooks/useUserCollections';

function Home() {
    const { data } = useUserCollections();

    return (
        <div>
            <Head>
                <title>My NFT Collections</title>
                <meta name='description' content='My NFT Collections' />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <main>
                <Container
                    minWidth='70vw'
                    padding='0'
                >
                    <Heading fontSize='2xl' margin='32px auto 32px 24px'>
                        MY NFT Collections
                    </Heading>
                    <Container
                        margin='0'
                        padding='0'
                        display='flex'
                        width='100%'
                        flexWrap='wrap'
                        maxWidth='100% !important'
                        justifyContent='center'
                    >
                        {
                            data && data.collections && data.collections.length > 0
                            && data.collections.map((item, key) => {
                                const { contract, name } = item;

                                return (
                                    contract && name && <Link
                                        key={key}
                                        href={`/nft/${contract}`}
                                    >
                                        <Box
                                            sx={{
                                                width: '180px',
                                                background: '#1d1d1d',
                                                borderRadius: '0',
                                                margin: '16px',
                                                border: '1px solid white',
                                                ':hover': { background: '#282828' }
                                            }}
                                        >
                                            <Avatar
                                                size={178}
                                                name={contract}
                                                variant='bauhaus'
                                                square={true}
                                                colors={[
                                                    '#FEAF60', '#BCFE65',
                                                    '#FEEBC8', '#933707',
                                                    '#C84E13', '#191919',
                                                    'white', '#00070f',
                                                    '#2D2D2D', '#1554F0'
                                                ]}
                                            />
                                            <Heading
                                                as='h2'
                                                fontSize='md'
                                                padding='16px 0'
                                                noOfLines={2}
                                                textAlign='center'
                                                borderTop='1px solid white'
                                            >
                                                {name}
                                            </Heading>
                                        </Box>
                                    </Link>
                                );
                            })}
                    </Container>
                </Container>
            </main>
        </div >
    );
}

export default Home;