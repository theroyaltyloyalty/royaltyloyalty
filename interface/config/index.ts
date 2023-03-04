export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID);
export const IS_CLIENT = typeof window !== 'undefined';
export const INFURA_API_URL = process.env.NEXT_PUBLIC_INFURA_API_URL || '';
export const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY || '';
export const INFURA_API_KEY_SECRET =
    process.env.NEXT_PUBLIC_INFURA_API_KEY_SECRET || '';
