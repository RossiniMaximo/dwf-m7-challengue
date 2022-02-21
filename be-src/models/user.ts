import { sequelize } from "../lib/seqConn";
import { Model, DataTypes } from "sequelize";

export const User = sequelize.define("auth", {
  email: DataTypes.STRING,
  fullname: DataTypes.STRING,
});
