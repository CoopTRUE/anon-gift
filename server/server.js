const express = require("express");
const path = require("path");
const cors = require('cors');


const app = express();
app.use(express.static(path.resolve(__dirname, "../client/dist")));


// connect database
const db = require('./db');

// get giftcard model
const Giftcard = require('./model')

// api
app.get('/getAvailable', cors(), async (req, res) => {
    /* returns giftcards and values
    {
        card name: [
            value,
            ...
        ],
        ...
    }
    */
    return res.json(await db.getCardsSafely())
})


// web3 stuff
const web3 = require('web3');
const constants = require('./constants');
app.get('/transaction', cors(), async (req, res) => {
    const { chainId, cardType, txnHash } = req.query;
    if (chainId===undefined || cardType===undefined || txnHash===undefined) {
        return res.status(400).json({ error: 'Missing parameters' })
    }

    console.log(chainId, cardType, txnHash)
    return res.json(true)
})

const PORT = process.env.PORT || 3000;
app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
});
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
