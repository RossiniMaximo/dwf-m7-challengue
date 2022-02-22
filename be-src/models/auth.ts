import { Model, DataTypes } from "sequelize";
import { isConstructorDeclaration } from "typescript";
import { sequelize } from "../lib/seqConn";

export class Auth extends Model {}
Auth.init(
  {
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
  },
  { sequelize, modelName: "Auth" }
);
