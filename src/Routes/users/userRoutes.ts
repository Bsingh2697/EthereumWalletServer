import express, {Application, Request, Response, NextFunction} from 'express';
import AES from 'crypto-js/AES';
import CryptoJS from 'crypto-js'

const controller = require('../../Controller/userController.ts')

const jwt = require('jsonwebtoken');

const router = express.Router();
const auth = require('../../Middlewares/auth');
const User = require('../../models/UserModel/User')
const {registerValidation, loginValidation} = require('../../Validation/validation') 

// ********************** Find All Users **********************
router.get('/',controller.fetchAllUsers)

// ********************** Find user by ID **********************
router.get('/:user_id',auth, controller.fetchUserDetails)

// ********************** Remove user by ID **********************
router.delete('/:user_id',auth, controller.deleteUser)

// ********************** SIGNUP - ADD NEW USER **********************
router.post('/signup',controller.signup)

// ********************** LOGIN - USER **********************
router.post('/signin',controller.signin)

module.exports = router;