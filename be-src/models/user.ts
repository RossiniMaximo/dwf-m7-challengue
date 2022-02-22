import { sequelize } from "../lib/seqConn";
import { Model, DataTypes } from "sequelize";

export class User extends Model {}
User.init(
  {
    email: DataTypes.STRING,
    fullname: DataTypes.STRING,
  },
  { sequelize, modelName: "User" }
);
