"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const config = process.env;
const verifyToken = (request, response, next) => {
    const token = request.body.token || request.query.token || request.headers['x-access-token'];
    if (!token) {
        return response.status(403).send('User not authorized');
    }
    try {
        const decode = jwt.verify(token, config.UNIQUE_USERNAME);
        request.user = decode;
        console.log("DECODED :", decode);
    }
    catch (error) {
        return response.status(401).send("Invalid Token");
    }
    return next();
};
module.exports = verifyToken;
