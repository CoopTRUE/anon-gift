const mongoose = require('mongoose');

module.exports = mongoose.model('usedtransactions', mongoose.Schema({
    hash: String,
    timestamp: Date,
    firstValue: String
}));