const Sequelize = require("sequelize");

module.exports = (sequelize, type) => {
    return sequelize.define("user", {
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        image: {
            type: Sequelize.BLOB
        },
        pdf: {
            type: Sequelize.BLOB
        }
    });
}