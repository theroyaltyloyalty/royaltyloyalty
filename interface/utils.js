export const formatWallet = (address) => {
    const { length } = address;
    return address.slice(0, 4) + '...' + address.slice(length - 4, length);
};