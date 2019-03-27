const express = require("express");
const bodyParser = require("body-parser");

const router = require("./routes");
const User = require("./db");

const server = express();
const port = process.env.PORT || 3000;

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(router);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});