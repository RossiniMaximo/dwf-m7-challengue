import { Model, DataTypes } from "sequelize";
import { sequelize } from "../lib/seqConn";

export const Pet = sequelize.define("pet", {
  petName: DataTypes.STRING,
  imgURL: DataTypes.TEXT,
  latitude: DataTypes.FLOAT,
  length: DataTypes.FLOAT,
  userId: DataTypes.INTEGER,
});
