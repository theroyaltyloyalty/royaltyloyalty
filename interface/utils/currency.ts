import { BigNumberish } from 'ethers';
import { commify, formatEther } from 'ethers/lib/utils';
import { round } from './number';
const ETH_SYMBOL = 'ETH';

export const convertToEth = (wei: BigNumberish) => {
    const eth = formatEther(wei);
    const rounded = round(eth, 6, false);
    const formattedRaw = commify(rounded);
    const formatted = `${wei} ${ETH_SYMBOL}`;

    return {
        raw: eth,
        rounded,
        formattedRaw,
        formatted,
    };
};
