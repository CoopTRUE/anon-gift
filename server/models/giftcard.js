const mongoose = require('mongoose');

module.exports = mongoose.model('giftcards', mongoose.Schema({
    type: String,
    value: Number,
    code: String
}));