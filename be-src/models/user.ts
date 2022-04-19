import { sequelize } from "../lib/seqConn";
import { DataTypes } from "sequelize";

export const User = sequelize.define("User", {
  email: DataTypes.STRING,
  fullname: DataTypes.STRING,
});
