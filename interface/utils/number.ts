export const round = (
    value: string | number,
    decimals = 4,
    showTrailingZeros = false
) => {
    const number = Number(value);
    const factor = Math.pow(10, decimals);
    const rounded = Math.round(number * factor) / factor;

    if (showTrailingZeros) {
        return rounded.toFixed(decimals);
    } else {
        return String(rounded);
    }
};

export const bpsToPercent = (num: string | number) => {
    const amount = Number(num);

    return parseFloat(round(amount / 100, 2));
};
