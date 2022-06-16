const mongoose = require('mongoose');

module.exports = mongoose.model('giftcards', mongoose.Schema({
    used: Boolean,
    type: String,
    value: Number,
    code: String,
    isFake: Boolean
}));