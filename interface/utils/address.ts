import { ethers } from 'ethers';

export function shortenAddress(address?: string, chars = 4) {
    address = address || ethers.constants.AddressZero;
    return `${address.substring(0, chars + 1)}...${address.substring(
        address.length - chars
    )}`;
}
