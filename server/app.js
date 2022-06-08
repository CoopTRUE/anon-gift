const express = require("express");
const path = require("path");

const app = express();


app.use(express.static(path.resolve(__dirname, "../client/dist")));

app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
