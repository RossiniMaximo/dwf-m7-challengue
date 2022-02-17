"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getNearbyMissedPets = exports.deletePet = exports.updatePet = exports.getPet = exports.getPets = exports.createPet = void 0;
/* Aca va la lógica de los endpoints relacionados a las mascotas */
var cloudinary_1 = require("../lib/cloudinary");
var index_1 = require("../models/index");
var algolia_1 = require("../lib/algolia");
function createPet(body) {
    return __awaiter(this, void 0, void 0, function () {
        var imgHolder, resImg, pet, savePetInAlgolia;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!body.imgURL) return [3 /*break*/, 2];
                    return [4 /*yield*/, cloudinary_1.cloudinary.uploader.upload(body.imgURL, {
                            resource_type: "image",
                            discard_original_filename: true,
                            width: 1000
                        })];
                case 1:
                    resImg = _a.sent();
                    imgHolder = resImg.secure_url;
                    _a.label = 2;
                case 2: return [4 /*yield*/, index_1.Pet.create({
                        petName: body.petName,
                        latitude: body.latitude,
                        length: body.length,
                        imgURL: imgHolder,
                        userId: body.userId
                    })];
                case 3:
                    pet = _a.sent();
                    return [4 /*yield*/, algolia_1.indexPets.saveObject({
                            objectID: pet.get("id"),
                            petName: pet.get("petName"),
                            imgURL: pet.get("imgURL"),
                            _geoloc: {
                                lat: pet.get("latitude"),
                                lng: pet.get("length")
                            }
                        })];
                case 4:
                    savePetInAlgolia = _a.sent();
                    return [2 /*return*/, pet];
            }
        });
    });
}
exports.createPet = createPet;
function getPets() {
    return __awaiter(this, void 0, void 0, function () {
        var pets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, index_1.Pet.findAll()];
                case 1:
                    pets = _a.sent();
                    return [2 /*return*/, pets];
            }
        });
    });
}
exports.getPets = getPets;
function getPet(petId) {
    return __awaiter(this, void 0, void 0, function () {
        var pet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, index_1.Pet.findByPk(petId)];
                case 1:
                    pet = _a.sent();
                    if (pet) {
                        return [2 /*return*/, pet];
                    }
                    else {
                        return [2 /*return*/, "error : there is no pet with the token provided"];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.getPet = getPet;
function bodyFormated(body, id) {
    var res = {};
    if (body.fullname) {
        res.fullname = body.fullname;
    }
    if (body.latitude && body.length) {
        res._geoloc = { lat: body.latitude, lng: body.length };
    }
    if (id) {
        res.objectID = id;
    }
    return res;
}
function updatePet(data, petId) {
    return __awaiter(this, void 0, void 0, function () {
        var updatePet_1, e_1, indexItem, updatedForAlgolia;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("pet id en pet-controller", petId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, index_1.Pet.update(data, { where: { id: petId } })];
                case 2:
                    updatePet_1 = _a.sent();
                    return [2 /*return*/, updatePet_1];
                case 3:
                    e_1 = _a.sent();
                    console.log("error en el controller pets", e_1);
                    return [3 /*break*/, 4];
                case 4:
                    indexItem = bodyFormated(data, petId);
                    return [4 /*yield*/, algolia_1.indexPets.partialUpdateObject(indexItem)];
                case 5:
                    updatedForAlgolia = _a.sent();
                    console.log("updatedForAlgolia :", updatedForAlgolia);
                    if (updatePet) {
                        return [2 /*return*/, updatePet];
                    }
                    else {
                        return [2 /*return*/, "error : there is no pet with the token provided"];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.updatePet = updatePet;
function deletePet(petId) {
    return __awaiter(this, void 0, void 0, function () {
        var petToDelete;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, index_1.Pet.findByPk(petId)];
                case 1:
                    petToDelete = _a.sent();
                    if (petToDelete) {
                        petToDelete.destroy();
                        return [2 /*return*/, "pet deleted succesfully"];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.deletePet = deletePet;
// UNDONE
// LO QUE HAY QUE HACER ES USAR LA IP DEL CLIENTE PARA SACAR SU LATITUD Y LNG
//  PERO ESTO SIRVE PARA VER QUE LAS MASCOTAS SE ESTAN CREANDO
function getNearbyMissedPets() {
    return __awaiter(this, void 0, void 0, function () {
        var hits;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, algolia_1.indexPets.search("", {
                        aroundLatLngViaIP: true,
                        aroundRadius: 15000,
                        headers: {
                            "X-Forwarded-For": "http://localhost:3001"
                        }
                    })];
                case 1:
                    hits = (_a.sent()).hits;
                    if (hits) {
                        return [2 /*return*/, hits];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.getNearbyMissedPets = getNearbyMissedPets;
