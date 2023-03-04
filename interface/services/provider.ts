import { InfuraProvider } from '@ethersproject/providers';
import { CHAIN_ID, INFURA_API_KEY } from 'config';

const infuraProvider = new InfuraProvider(CHAIN_ID, INFURA_API_KEY);

export default infuraProvider;
