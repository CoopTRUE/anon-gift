const mongoose = require('mongoose');

module.exports = (async (verbose=true) => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
    if (verbose) console.log('Connected to MongoDB');
});