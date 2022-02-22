import { Model, DataTypes } from "sequelize";
import { isConstructorDeclaration } from "typescript";
import { sequelize } from "../lib/seqConn";

export const Auth = sequelize.define("Auth", {
  password: DataTypes.STRING,
  email: DataTypes.STRING,
  user_id: DataTypes.INTEGER,
});
