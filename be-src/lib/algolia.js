"use strict";
exports.__esModule = true;
exports.indexPets = void 0;
var algoliasearch_1 = require("algoliasearch");
var client = algoliasearch_1["default"]("BO7KH091QS", process.env.ALGOLIA_API_KEY);
var indexPets = client.initIndex("pets");
exports.indexPets = indexPets;
