"use strict";
exports.__esModule = true;
exports.sequelize = void 0;
var sequelize_1 = require("sequelize");
var sequelize = new sequelize_1.Sequelize({
    dialect: "postgres",
    username: "pfyolxvytmtndv",
    password: "4395e7509ee8702e8d71180be9fdc75f77b181501125b6ef93351036afc96653",
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
