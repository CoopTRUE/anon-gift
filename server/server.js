const express = require("express");
const path = require("path");
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(express.static(path.resolve(__dirname, "../client/dist")));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function () {
    console.log("MongoDB database connection established successfully!");
})

// api
app.get('/getAvailable', cors(), async (req, res) => {
    console.log(req.json);
    return res.json( true );
})


const PORT = process.env.PORT || 5000;
app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
});
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
