// ********************** IMPORTS **********************
import express, {Application, Request, Response, NextFunction} from 'express';
import {Database} from './src/DatabaseConnection'
import { URL_CONSTANTS } from './src/utils/constants/UrlConstants';

// ********************** Module Imports **********************
const cors = require('cors')

// ********************** IMPORT ROUTES **********************
const usersRoute = require('./src/Routes').user

// ********************** Create Application **********************
const app: Application = express();

// ********************** Middleware And Routes **********************

//  
app.use('./',"Hello World!")

// ********************** SET PORT **********************
const PORT = process.env.PORT || 3000 || 8080;
app.listen(PORT,()=>console.log("Server running"));
