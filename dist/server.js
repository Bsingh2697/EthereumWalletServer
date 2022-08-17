"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ********************** IMPORTS **********************
const express_1 = __importDefault(require("express"));
// ********************** Module Imports **********************
const cors = require('cors');
// ********************** IMPORT ROUTES **********************
const usersRoute = require('./src/Routes').user;
// ********************** Create Application **********************
const app = (0, express_1.default)();
// ********************** Middleware And Routes **********************
//     // Middleware
//     app.use(cors())
//     app.use(express.json())
//     // ROUTES
//     app.use(URL_CONSTANTS.user,usersRoute)
// // ********************** INIT FUNCTION **********************
// const init = async() => {
//     const db = new Database();
//     await db.connectToDb() 
// }
// // ********************** INITIALIZE APPLICATION **********************
// init();
// ********************** SET PORT **********************
const PORT = process.env.PORT || 3000 || 8080;
app.listen(PORT, () => console.log("Server running"));
