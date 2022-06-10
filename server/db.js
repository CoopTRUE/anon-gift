const mongoose = require('mongoose');

async function connect(verbose=true) {
    if (verbose) console.log('Connecting to database...')
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
    if (verbose) console.log('Connected to MongoDB');
}
connect()

const Giftcard = require('./models/giftcard')
const Transaction = require('./models/transaction')

async function addCard(type, value, code) {
    const giftcard = new Giftcard({type, value, code})
    await giftcard.save()
}

async function getCardsSafely() {
    /* returns giftcards and values
    {
        card name: [
            value,
            ...
        ],
        ...
    }
    */
    const cards = await Giftcard.find()
    return cards.reduce((acc, card) => {
        const { id, type, value, code } = card;
        if (type in acc) {
            if (!(value in acc[type])) {
                acc[type].push(value)
            }
        }
        else {
            acc[type] = [value]
        }
        return acc;
    }, {})
}

async function getTransactions() {
    const transactions = await Transaction.find()
    return transactions.map(transaction => transaction.hash)
}

async function retrieveCard(type, value) {
    const giftcard = await Giftcard.findOneAndDelete({type, value})
    return giftcard.code
}

async function addTransaction(hash) {
    const transaction = new Transaction({hash})
    await transaction.save()
}

module.exports = {
    'addCard': addCard,
    'addTransaction': addTransaction,
    'getCardsSafely': getCardsSafely,
    'getTransactions': getTransactions,
    'retrieveCard': retrieveCard
}