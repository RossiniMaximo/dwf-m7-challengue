"use strict";
exports.__esModule = true;
exports.cloudinary = void 0;
var cloudinary = require("cloudinary").v2;
exports.cloudinary = cloudinary;
cloudinary.config({
    cloud_name: "dqjrcykr7",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: "poSSJ1j1MCm9u8iXdkHD1v3ebeo"
});
