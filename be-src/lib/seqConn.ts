import { Sequelize } from "sequelize";
require("dotenv").config();
const sequelize = new Sequelize({
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
      rejectUnauthorized: false,
    },
  },
});

export { sequelize };
