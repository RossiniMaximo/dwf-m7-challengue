import { Model, DataTypes } from "sequelize";
import { sequelize } from "../lib/seqConn";

export class Pet extends Model {
  constructor() {
    super();
  }
}
Pet.init(
  {
    petName: DataTypes.STRING,
    imgURL: DataTypes.TEXT,
    latitude: DataTypes.FLOAT,
    length: DataTypes.FLOAT,
    userId: DataTypes.INTEGER,
  },
  { sequelize, modelName: "pet" }
);
