import Avatar from 'components/Avatar';
import Head from 'next/head';
import Link from 'next/link';
import * as React from 'react';
import useUserCollections from '../hooks/useUserCollections';

function Home() {
    const { data } = useUserCollections();

    return (
        <div>
            <Head>
                <title>Royalty Loyalty</title>
                <meta name="description" content="My NFT Collections" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="container-content py-16">
                <div className="font-bold text-2xl mb-6">
                    MY NFT Collections
                </div>
                <div className="flex items-center space-x-8">
                    {data?.collections?.map((item, key) => {
                        const { contract, name } = item;
                        return (
                            contract &&
                            name && (
                                <Link key={key} href={`/nft/${contract}`}>
                                    <div className="hover:text-white/75 transition-colors duration-200">
                                        <Avatar
                                            name={contract}
                                            size={180}
                                            square={true}
                                            className="rounded-md"
                                        />
                                        <div className="font-bold py-4 ">
                                            {name}
                                        </div>
                                    </div>
                                </Link>
                            )
                        );
                    })}
                </div>
            </main>
        </div>
    );
}

export default Home;
