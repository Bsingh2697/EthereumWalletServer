"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ********************** IMPORTS **********************
const express_1 = __importDefault(require("express"));
const UrlConstants_1 = require("./src/utils/constants/UrlConstants");
const mongoose_1 = __importDefault(require("mongoose"));
// ********************** Module Imports **********************
const cors = require('cors');
// ********************** IMPORT ROUTES **********************
const usersRoute = require('./src/Routes').user;
// ********************** Create Application **********************
const app = (0, express_1.default)();
// ********************** Middleware And Routes **********************
// Middleware
app.use(cors());
app.use(express_1.default.json());
// ROUTES
app.use(UrlConstants_1.URL_CONSTANTS.user, usersRoute);
// // ********************** INIT FUNCTION **********************
// const init = async() => {
//     const db = new Database();
//     await db.connectToDb() 
// }
// // ********************** INITIALIZE APPLICATION **********************
// init();
let connRes;
try {
    let connStr = `${process.env.DB_URL}${process.env.DB_NAME}`;
    mongoose_1.default.connect(connStr);
    const conn = mongoose_1.default.connection;
    conn.once('connected', () => {
        console.log("Connected");
        connRes = "Connected";
    });
    conn.once('error', () => (console.log("Error"), connRes = "Error"));
    conn.once('open', () => console.log("Open"));
}
catch (error) {
}
app.get('/', (req, res) => {
    res.send(`hello world SIR, ${connRes}`);
});
// ********************** SET PORT **********************
const PORT = process.env.PORT || 3000 || 8080;
app.listen(PORT, () => console.log("Server running"));
