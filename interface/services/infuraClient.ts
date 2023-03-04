import axios from 'axios';
import { INFURA_API_KEY, INFURA_API_URL } from 'config';

const infuraClient = axios.create({
    baseURL: INFURA_API_URL,
    headers: {
        'X-Api-Key': INFURA_API_KEY,
        'Content-Type': 'application/json',
    },
});

export default infuraClient;
