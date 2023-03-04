import axios from 'axios';
import { INFURA_API_KEY, INFURA_API_KEY_SECRET, INFURA_API_URL } from 'config';

const AuthHash = Buffer.from(
    INFURA_API_KEY + ':' + INFURA_API_KEY_SECRET
).toString('base64');

const infuraClient = axios.create({
    baseURL: INFURA_API_URL,
    headers: {
        Authorization: `Basic ${AuthHash}`,
        'Content-Type': 'application/json',
    },
});

export default infuraClient;
