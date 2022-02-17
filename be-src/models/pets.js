"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Pet = void 0;
var sequelize_1 = require("sequelize");
var seqConn_1 = require("../lib/seqConn");
var Pet = /** @class */ (function (_super) {
    __extends(Pet, _super);
    function Pet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Pet;
}(sequelize_1.Model));
exports.Pet = Pet;
Pet.init({
    petName: sequelize_1.DataTypes.STRING,
    imgURL: sequelize_1.DataTypes.TEXT,
    latitude: sequelize_1.DataTypes.FLOAT,
    length: sequelize_1.DataTypes.FLOAT,
    userId: sequelize_1.DataTypes.INTEGER
}, { sequelize: seqConn_1.sequelize, modelName: "pet" });
