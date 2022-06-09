const mongoose = require('mongoose');

async function connect(verbose=true) {
    if (verbose) console.log('Connecting to database...')
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
    if (verbose) console.log('Connected to MongoDB');
}
connect()

const Giftcard = require('./model')

async function addCard(name, value, code) {
    const giftcard = new Giftcard({name, value, code})
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
        const { id, name, value, code } = card;
        if (name in acc) {
            if (!(value in acc[name])) {
                acc[name].push(value)
            }
        }
        else {
            acc[name] = [value]
        }
        return acc;
    }, {})
}

async function retrieveCard(type, value) {

}
module.exports = {
    'addCard': addCard,
    'getCardsSafely': getCardsSafely,
    'retrieveCard': retrieveCard
}