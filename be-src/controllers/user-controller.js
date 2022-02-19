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
exports.sendEmail = exports.updateUser = exports.myInfo = exports.authToken = exports.createUserAndAuth = exports.checkUserPassword = exports.findUserByEmail = void 0;
var auth_1 = require("../models/auth");
var user_1 = require("../models/user");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var sgEmail = require("@sendgrid/mail");
console.log(sgEmail);
require("dotenv").config();
sgEmail.setApiKey(process.env.SENDGRID_API_KEY);
function getSHA256ofString(password) {
    return crypto.createHash("sha256").update(password).digest("hex");
}
//  a function that returns only 1 user if it exists.
function findUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function () {
        var findUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, user_1.User.findOne({ where: { email: email } })];
                case 1:
                    findUser = _a.sent();
                    if (findUser) {
                        return [2 /*return*/, findUser];
                    }
                    else {
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.findUserByEmail = findUserByEmail;
function checkUserPassword(password) {
    return __awaiter(this, void 0, void 0, function () {
        var authPass;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, auth_1.Auth.findOne({
                        where: { password: getSHA256ofString(password) }
                    })];
                case 1:
                    authPass = _a.sent();
                    if (authPass) {
                        return [2 /*return*/, authPass];
                    }
                    else {
                        return [2 /*return*/, "Contraseña erronéa"];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.checkUserPassword = checkUserPassword;
// Create user & auth on their tables.
function createUserAndAuth(data) {
    return __awaiter(this, void 0, void 0, function () {
        var email, fullname, password, _a, user, created, _b, auth, authCreated;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    email = data.email, fullname = data.fullname, password = data.password;
                    return [4 /*yield*/, user_1.User.findOrCreate({
                            where: {
                                email: email
                            },
                            defaults: {
                                email: email,
                                fullname: fullname
                            }
                        })];
                case 1:
                    _a = _c.sent(), user = _a[0], created = _a[1];
                    return [4 /*yield*/, auth_1.Auth.findOrCreate({
                            where: { user_id: user.get("id") },
                            defaults: {
                                email: email,
                                password: getSHA256ofString(password),
                                user_id: user.get("id")
                            }
                        })];
                case 2:
                    _b = _c.sent(), auth = _b[0], authCreated = _b[1];
                    return [2 /*return*/, user];
            }
        });
    });
}
exports.createUserAndAuth = createUserAndAuth;
// Create token by Auth table hashed password
function authToken(email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var hashedPassword, auth, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hashedPassword = getSHA256ofString(password);
                    return [4 /*yield*/, auth_1.Auth.findOne({
                            where: { email: email, password: hashedPassword }
                        })];
                case 1:
                    auth = _a.sent();
                    token = jwt.sign({ id: auth.get("user_id") }, process.env.SECRET_KEY);
                    if (auth) {
                        return [2 /*return*/, { token: token }];
                    }
                    else {
                        return [2 /*return*/, "error , datos no coincidientes con usuarios."];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.authToken = authToken;
function myInfo(req) {
    return __awaiter(this, void 0, void 0, function () {
        var splittedHeader, token, data;
        return __generator(this, function (_a) {
            splittedHeader = req.headers.authorization.split(" ");
            token = splittedHeader[1];
            data = jwt.verify(token, process.env.SECRET_KEY);
            return [2 /*return*/, data];
        });
    });
}
exports.myInfo = myInfo;
function updateUser(email, fullname, password) {
    return __awaiter(this, void 0, void 0, function () {
        var hashedPassword, user, userAuth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hashedPassword = getSHA256ofString(password);
                    return [4 /*yield*/, user_1.User.findOne({ where: { email: email } })];
                case 1:
                    user = _a.sent();
                    return [4 /*yield*/, auth_1.Auth.findOne({ where: { user_id: user.get("id") } })];
                case 2:
                    userAuth = _a.sent();
                    if (!user) return [3 /*break*/, 4];
                    return [4 /*yield*/, user.update({ fullname: fullname })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    if (!userAuth) return [3 /*break*/, 6];
                    return [4 /*yield*/, userAuth.update({ password: hashedPassword })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.updateUser = updateUser;
function sendEmail(to, from, text, subject) {
    return __awaiter(this, void 0, void 0, function () {
        var msg, sendEmail_1, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    msg = {
                        to: to,
                        from: from,
                        subject: subject,
                        html: text
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, sgEmail.send(msg)];
                case 2:
                    sendEmail_1 = _a.sent();
                    return [2 /*return*/, sendEmail_1];
                case 3:
                    e_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.sendEmail = sendEmail;
