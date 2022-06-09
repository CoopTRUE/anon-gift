const mongoose = require('mongoose');

module.exports = mongoose.model('giftcards', mongoose.Schema({
    name: String,
    value: Number,
    code: String
}));