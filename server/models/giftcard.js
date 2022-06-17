const mongoose = require('mongoose');

module.exports = mongoose.model('giftcards', mongoose.Schema({
    fake: Boolean,
    type: String,
    value: Number,
    code: String,
}));