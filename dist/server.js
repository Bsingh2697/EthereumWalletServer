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
// ********************** IMPORTS **********************
const express_1 = __importDefault(require("express"));
const DatabaseConnection_1 = require("./src/DatabaseConnection");
const UrlConstants_1 = require("./src/utils/constants/UrlConstants");
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
// ********************** INIT FUNCTION **********************
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = new DatabaseConnection_1.Database();
    yield db.connectToDb();
});
// ********************** INITIALIZE APPLICATION **********************
init();
app.get('/', (req, res) => {
    res.send('hello world SIR');
});
// ********************** SET PORT **********************
const PORT = process.env.PORT || 3000 || 8080;
app.listen(PORT, () => console.log("Server running"));
