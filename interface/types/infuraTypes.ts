export interface Collection {
    contract: string;
    name: string;
    symbol: string;
    tokenType: string;
}

export interface Metadata {
    animation_url?: string;
    description?: string;
    external_link?: string;
    image?: string;
    name?: string;
}

export interface Asset {
    contract: string;
    tokenId: string;
    supply: string;
    type: string;
    metadata?: Metadata;
}

export interface Token {
    pageNumber: number;
    pageSize: number;
    network: string;
    total: number;
    account: string;
    cursor: string;
    assets: Asset[];
}

export interface Owner {
    amount: string;
    blockNumber: string;
    blockNumberMinted: string;
    contractType: string;
    metadata?: Metadata;
    minterAddress: string;
    name: string;
    ownerOf: string;
    symbol: string;
    tokenAddress: string;
    tokenHash: string;
    tokenId: string;
}

export interface Transfer {
    tokenAddress: string;
    tokenId: string;
    fromAddress: string;
    toAddress: string;
    contractType: string;
    price: string;
    quantity: string;
    blockNumber: string;
    blockTimestamp: string;
    blockHash: string;
    transactionHash: string;
    transactionType: string;
}
