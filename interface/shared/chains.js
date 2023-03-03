const polygonPocket = {
    id: 137,
    name: 'Polygon',
    network: 'matic',
    nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
    },
    rpcUrls: {
        default: {
            http: ['https://poly-mainnet.gateway.pokt.network/v1/lb/101f27bb3d7017b30ecc17e1']
        },
        public: {
            http: ['https://poly-mainnet.gateway.pokt.network/v1/lb/101f27bb3d7017b30ecc17e1']
        }
    },
    blockExplorers: {
        etherscan: {
            name: 'PolygonScan',
            url: 'https://polygonscan.com'
        },
        default: {
            name: 'PolygonScan',
            url: 'https://polygonscan.com'
        }
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 25770160,
        }
    }
};

export { polygonPocket };
