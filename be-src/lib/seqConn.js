"use strict";
exports.__esModule = true;
exports.sequelize = void 0;
var sequelize_1 = require("sequelize");
require("dotenv").config();
var sequelize = new sequelize_1.Sequelize({
    dialect: "postgres",
    username: "pfyolxvytmtndv",
    password: process.env.SEQUELIZE_PASS,
    database: "d6jknv4v56n0f8",
    port: 5432,
    host: "ec2-54-174-43-13.compute-1.amazonaws.com",
    ssl: true,
    // esto es necesario para que corra correctamente
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});
exports.sequelize = sequelize;
