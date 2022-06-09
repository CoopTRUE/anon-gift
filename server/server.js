const express = require("express");
const path = require("path");
const cors = require('cors');
const mongoose = require('mongoose');


const app = express();

app.use(express.static(path.resolve(__dirname, "../client/dist")));


// connect database
require('./connectDb')()

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
    return res.json((await Giftcard.find()).reduce((acc, card) => {
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
    }, {}))
})


const PORT = process.env.PORT || 3000;
app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
});
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
