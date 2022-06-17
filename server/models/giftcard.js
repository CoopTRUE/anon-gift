const mongoose = require('mongoose');

module.exports = mongoose.model('giftCards', mongoose.Schema({
    fake: Boolean,
    type: String,
    value: Number,
    code: String,
}));