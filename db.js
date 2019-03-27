const Sequelize = require("sequelize");
const UserModel = require("./models/user");

const sequelize = new Sequelize("sltestusers", "root", "testdb", {
    dialect: "mysql",
    define: {
        freezeTableName: true,
        charset: "utf8",
        dialectOptions: {
            collate: "utf8_general_ci"
        },
        timestamps: false,
    },
    logging: false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize.sync()
    .then(() => {
        console.log("Connected to sltestusers");
    })
    .catch(e => {
        console.log(e);
    });

const User = UserModel(sequelize, Sequelize);

module.exports = User;