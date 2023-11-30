const express = require("express");
const app = express()
const hostname = "127.0.0.1";
const port = 3000;

app.get("/", function (req, res) {
    return res.send("hello worlds");
})

app.listen(port, hostname, function () {
    console.log(`Sever running at http://${hostname}:${port}/`);
})