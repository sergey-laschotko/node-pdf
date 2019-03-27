const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");
const mysql = require("mysql");
const PDFDocument = require("pdfkit");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "testdb",
    database: "sltestusers"
});

connection.connect((err) => {
    if (err) {
        console.error(err.stack);
        return;
    }

    console.log(`Connected to MySQL as id ${connection.threadId}`);
});

const server = express();
const port = process.env.PORT || 3000;

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.get("/fill", async (req, res) => {
    let response = await axios("https://randomuser.me/api/?results=5");
    let users = response.data.results;
    let transformedUsers = [];
    users.map(user => {
        let transformedUser = {
            firstName: user.name.first[0].toUpperCase() + user.name.first.slice(1),
            lastName: user.name.last[0].toUpperCase() + user.name.last.slice(1),
            image: user.picture.large
        };
        transformedUsers.push(transformedUser);
    });

    let results = [];

    connection.query("DELETE FROM user");

    let resultsNumber = 0;

    transformedUsers.map(async (user, index) => {
        let image = await axios.request({
            method: "GET",
            url: user.image,
            responseType: "arraybuffer",
            responseEncoding: "binary"
        });

        let queryUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            image
        };


        connection.query("INSERT INTO user SET ?", queryUser, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log("User saved");
            resultsNumber += 1;
            if (resultsNumber === transformedUsers.length) {
                res.json("Users saved");
            }
        });
    });
});

server.post("/create-pdf", (req, res) => {
    const userName = req.body.firstName;


});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});