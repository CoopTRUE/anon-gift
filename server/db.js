const mongoose = require('mongoose');

async function connect(verbose=true) {
    if (verbose) console.log('Connecting to database...')
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
    if (verbose) console.log('Connected to MongoDB');
}
connect(!process.argv[1].endsWith('newCard.js'))

const GiftCard = require('./models/giftcard')
const Transaction = require('./models/transaction')
const fake = process.argv.includes('fakeCards');

async function addCard(fake, type, value, code) {
    const giftCard = new GiftCard({ fake, type, value, code })
    await giftCard.save()
}

async function getCardsSafely() {
    /* returns gift cards and values
    {
        card name: [
            value,
            ...
        ],
        ...
    }
    */
    const cards = await GiftCard.find({ fake })
    return cards.reduce((acc, card) => {
        const { id, fake, type, value, code } = card;
        if (type in acc) {
            if (!acc[type].includes(value)) {
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
    let giftCard;
    if (process.env.NODE_ENV === 'production') {
        giftCard = await GiftCard.findOneAndDelete({ fake, type, value })
    } else {
        giftCard = await GiftCard.findOne({ fake, type, value })
    }
    return giftCard.code
}

async function addTransaction(hash) {
    const transaction = new Transaction({ hash })
    await transaction.save()
}

module.exports = {
    'addCard': addCard,
    'addTransaction': addTransaction,
    'getCardsSafely': getCardsSafely,
    'getTransactions': getTransactions,
    'retrieveCard': retrieveCard
}