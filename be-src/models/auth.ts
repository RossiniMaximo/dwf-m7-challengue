import { Model, DataTypes } from "sequelize";
import { sequelize } from "../lib/seqConn";

export const Auth = sequelize.define("auth", {
  password: DataTypes.STRING,
  email: DataTypes.STRING,
  user_id: DataTypes.INTEGER,
});
