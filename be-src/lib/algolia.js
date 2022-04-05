"use strict";
exports.__esModule = true;
exports.indexPets = void 0;
var algoliasearch_1 = require("algoliasearch");
require("dotenv").config();
console.log("hola", process.env.ALGOLIA_API_KEY);
var client = (0, algoliasearch_1["default"])(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);
var indexPets = client.initIndex(process.env.ALGOLIA_INDEX_NAME);
exports.indexPets = indexPets;
