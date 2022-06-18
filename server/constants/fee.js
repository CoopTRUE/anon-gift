
const initialFee = 1
const percentage = 0.07

function round(num) {
    return Math.round(num * 10000) / 10000
}


module.exports = {
    addFee: initialCost => {
        return round(initialCost * (1 + percentage) + initialFee);
    },
    removeFee: initialCost => {
        return round((initialCost - initialFee) / (1 + percentage));
    }
}