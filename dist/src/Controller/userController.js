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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AES_1 = __importDefault(require("crypto-js/AES"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel/User');
const { registerValidation, loginValidation } = require('../Validation/validation');
// ********************** FETCH ALL USER ROUTE: "/" **********************
exports.fetchAllUsers = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("REQUEST : ", request);
    console.log("REQUEST : ", request === null || request === void 0 ? void 0 : request.user);
    console.log("REQUEST PARAM : ", request.params);
    console.log("REQUEST BODY: ", request.body);
    try {
        const users = yield User.find();
        response.status(200).send({ status: { code: 200, message: "Success" }, data: { users: users } });
    }
    catch (err) {
        response.status(400).send({ status: { code: 400, message: { header: "Error fetching users", body: err } } });
    }
});
// ********************** FETCH USER DETAILS ROUTE: "/:user_id" **********************
exports.fetchUserDetails = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("ID : ", request.params.user_id);
        const user = yield User.findById(request.params.user_id);
        const address = AES_1.default.decrypt(user === null || user === void 0 ? void 0 : user.address, process.env.UNIQUE_USERNAME).toString(crypto_js_1.default.enc.Utf8);
        user ? response.status(200).send({ status: { code: 200, message: "Success" }, data: { user: user === null || user === void 0 ? void 0 : user._id, address: address } }) :
            response.status(400).send({ status: { code: 400, message: { header: "Error fetching user details", body: "Unable to find user with the provided ID" } } });
        // data:{user_id: user._id,address: user.address}});
    }
    catch (err) {
        response.status(400).send({ status: { code: 400, message: { header: "Error fetching user details", body: "Unable to find user details, please try again!" } } });
    }
});
// ********************** FETCH USER PRIVATE KEY: "/key" **********************
exports.fetchUserPrivateKey = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("request", request === null || request === void 0 ? void 0 : request.user);
        const user = yield User.findById(request.user.user_id);
        user ? response.status(200).send({ status: { code: 200, message: "Success" }, data: { key: user === null || user === void 0 ? void 0 : user.private_key_pwd } }) :
            response.status(400).send({ status: { code: 400, message: { header: "Error fetching user key", body: "Some error occurred, please try again!" } } });
    }
    catch (err) {
        response.status(400).send({ status: { code: 400, message: { header: "Error fetching user key", body: "Unable to fetch user key, please try again!" } } });
    }
});
// ********************** DELETE USER ROUTE: "/:user_id" **********************
exports.deleteUser = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    // response.send("WE WANT MY DETAILS"); 
    try {
        const user = yield User.remove({ _id: request.params.user_id });
        response.status(200).send({ status: { code: 200, message: { header: "Success", body: "User has been removed successfully" } } });
    }
    catch (err) {
        response.status(400).send({ status: { code: 400, message: { header: "Error deleting user", body: "Unable to delete user, please try again!" } } });
    }
});
// ********************** REGISTER USER ROUTE: "/:signup" **********************
exports.signup = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    // === VALIDATING DATA ===
    const { error } = registerValidation(request.body);
    if (error)
        return response.status(400).send({ status: { code: 400, message: { header: "Validation error", body: error.details[0].message } } });
    let privateKey = request.body.privateKey;
    let address = request.body.address;
    let username = request.body.username;
    let password = request.body.password;
    let uniqueKey = process.env.UNIQUE_USERNAME;
    console.log("UQ:", uniqueKey);
    // PRIVATE KEY
    const encryptedPRK_uname = AES_1.default.encrypt(privateKey, username).toString();
    const encryptedPRK_pwd = AES_1.default.encrypt(privateKey, password).toString();
    // ADDRESS
    const encryptedAddress = AES_1.default.encrypt(address, uniqueKey).toString();
    // USERNAME
    const encryptedUname_pk = AES_1.default.encrypt(username, privateKey).toString();
    const encryptedUname_pwd = AES_1.default.encrypt(username, password).toString();
    // PASSWORD
    const encryptedPwd_pk = AES_1.default.encrypt(password, privateKey).toString();
    const encryptedPwd_uname = AES_1.default.encrypt(password, username).toString();
    // UNIQUENAME
    const uniqueUname = AES_1.default.encrypt(username, uniqueKey).toString();
    // === CHECKING IF USERNAME IS UNIQUE OR NOT
    const usernameList = yield User.find({}, { '_id': 0, 'unique_user': 1 });
    let isUnique = true;
    for (var i = 0; i < usernameList.length; i++) {
        let uname = AES_1.default.decrypt(usernameList[i].unique_user, process.env.UNIQUE_USERNAME).toString(crypto_js_1.default.enc.Utf8);
        console.log("Uname : ", uname);
        console.log("Username : ", username);
        if (uname == username) {
            isUnique = false;
            break;
        }
    }
    if (!isUnique)
        return response.status(400).send({ status: { code: 400, message: { header: "Username not available", body: "Username already exusts" } } });
    // === CREATING USER ===
    const user = new User({
        private_key_uname: encryptedPRK_uname,
        private_key_pwd: encryptedPRK_pwd,
        address: encryptedAddress,
        username_pk: encryptedUname_pk,
        username_pwd: encryptedUname_pwd,
        password_pk: encryptedPwd_pk,
        password_uname: encryptedPwd_uname,
        unique_user: uniqueUname
    });
    try {
        // create user
        let savedUser = yield user.save();
        // create token
        const token = yield jwt.sign({ user_id: savedUser === null || savedUser === void 0 ? void 0 : savedUser._id, }, uniqueKey, { algorithm: 'HS256' }, { expiresIn: 10000000 });
        savedUser.token = token;
        console.log("NEW USER CREATED : ", savedUser);
        // WE CAN ACTUALLY JUST SEND BACK TOKEN AND BASED ON THAT PERFORM OPERATIONS
        // NO NEED TO PASS _ID - WE can implement it later        
        return response.status(200).send({ status: { code: 200, message: "Success" }, data: { user: { user_id: savedUser._id._id, address: address }, token: token } });
    }
    catch (err) {
        response.status(400).json({ message: err });
    }
});
// ********************** REGISTER USER ROUTE: "/:signin" **********************
exports.signin = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    // === VALIDATING DATA ===
    const { error } = loginValidation(request.body);
    if (error)
        return response.status(400).send({ status: { code: 400, message: { header: "Validation error", body: error.details[0].message } } });
    const username = request.body.username;
    const password = request.body.password;
    let uniqueKey = process.env.UNIQUE_USERNAME;
    // === USER EXISTS ===
    try {
        const usersList = yield User.find({}, { '_id': 0, 'username_pwd': 1, 'password_uname': 1 });
        console.log("USER LIST : ", usersList);
        console.log("USERNAME : ", request.body.username);
        console.log("Password : ", request.body.password);
        let userData = new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            for (var i = 0; i < usersList.length; i++) {
                console.log("USERName PARAMS : ", usersList[i].username_pwd, " - ", username);
                console.log("Password PARAMS : ", usersList[i].password_uname, " - ", password);
                console.log("TYPE OF USERNAME: ", typeof username);
                console.log("TYPE OF Password: ", typeof password);
                let uname;
                let pwd;
                try {
                    uname = AES_1.default.decrypt(usersList[i].username_pwd, password).toString(crypto_js_1.default.enc.Utf8);
                    pwd = AES_1.default.decrypt(usersList[i].password_uname, username).toString(crypto_js_1.default.enc.Utf8);
                }
                catch (e) {
                    console.log(e);
                    continue;
                }
                console.log("UNAME :", uname);
                console.log("PWD :", pwd);
                if (uname == username && pwd == password) {
                    // console.log("User data Found: ",userData);
                    let returnData = yield User.find({ "$and": [
                            { "username_pwd": usersList[i].username_pwd },
                            { "password_uname": usersList[i].password_uname }
                        ] }, { "unique_user": 0 });
                    console.log("returnData : ", returnData);
                    resolve(returnData);
                    break;
                }
            }
            reject();
        }))
            .then((res) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            console.log("SUCCESS PROMISE", res);
            const token = yield jwt.sign({ user_id: (_a = res[0]) === null || _a === void 0 ? void 0 : _a._id, }, uniqueKey, { algorithm: 'HS256' }, { expiresIn: 10000000 });
            let address = AES_1.default.decrypt((_b = res[0]) === null || _b === void 0 ? void 0 : _b.address, process.env.UNIQUE_USERNAME).toString(crypto_js_1.default.enc.Utf8);
            return response.status(200).send({ status: { code: 200, message: "Success" }, data: { user: { user_id: res[0]._id, address: address }, token: token } });
        })).catch((error) => {
            return response.status(400).send({ status: { code: 400, message: { header: "Invalid Credentials", body: "Please try with correct credentials" } } });
        });
    }
    catch (error) {
        return response.status(400).send({ status: { code: 400, message: { header: "Invalid Credentials", body: "Please try with correct credentials" } } });
    }
});
