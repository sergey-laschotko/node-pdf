const router = require("express").Router();
const axios = require("axios");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const User = require("./db");

router.post("/create-user-pdf", async (req, res) => {
    const userName = req.body.firstName;
    const user = await User.findOne({
        where: {
            firstName: userName
        }
    });

    const imageFileName = `${userName}.jpg`;

    fs.writeFileSync(imageFileName, user.image, "binary");

    const pdf = new PDFDocument;
    const newPdf = fs.createWriteStream(`${userName}.pdf`);

    pdf.pipe(newPdf);
    pdf.font('fonts/Roboto-Regular.ttf')
        .fontSize(30)
        .text(`${user.firstName} ${user.lastName}`, 50, 50);
    pdf.image(imageFileName);
    pdf.end();

    newPdf.on("finish", async () => {
        user.pdf = fs.readFileSync(`${userName}.pdf`);
        
        const result = await User.update(
            { pdf: user.pdf },
            { where: { firstName: userName }}
        );
    
        result[0] ? res.json(true) : res.json(false);

        fs.unlinkSync(imageFileName);
        fs.unlinkSync(`${userName}.pdf`);
    });
});

router.get("/fill-mock-data", async (req, res) => {
    User.destroy({ where: {} });
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

    const queryUsers = await Promise.all(transformedUsers.map(async (user) => {
        const imageBuffer = await axios.request({
            method: "GET",
            url: user.image,
            responseType: "arraybuffer",
            responseEncoding: "binary"
        });

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            image: imageBuffer.data
        };
    }));
    const result = await User.bulkCreate(queryUsers, { returning: true });
    res.json(result);
});

module.exports = router;