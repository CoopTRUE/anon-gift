
const initialFee = 1
const percentage = 0.07

function round(num) {
    return Math.round(num * 10000) / 10000
}


export const addFee = initialCost => {
    return round(initialCost * (1 + percentage) + initialFee);
}

export const removeFee = initialCost => {
    return round((initialCost - initialFee) / (1 + percentage));
}