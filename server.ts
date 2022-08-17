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

    // Middleware
    app.use(cors())
    app.use(express.json())
    // ROUTES
    app.use(URL_CONSTANTS.user,usersRoute)

// ********************** INIT FUNCTION **********************
const init = async() => {
    const db = new Database();
    await db.connectToDb() 
}

// ********************** INITIALIZE APPLICATION **********************
init();

app.get('/', (req, res) => {
  res.send('hello world SIR')
})

// ********************** SET PORT **********************
const PORT = process.env.PORT || 3000 || 8080;
app.listen(PORT,()=>console.log("Server running"));
