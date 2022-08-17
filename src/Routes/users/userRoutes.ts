import express, {Application, Request, Response, NextFunction} from 'express';

const controller = require('../../Controller/userController.ts')

const jwt = require('jsonwebtoken');

const router = express.Router();
const auth = require('../../Middlewares/auth');
const User = require('../../models/UserModel/User')
const {registerValidation, loginValidation} = require('../../Validation/validation') 


/*
** Order of routes matter
** If we put "/key" route under "/:user_id" then
** we won't be able to access "/key" route
*/

// ********************** Test API **********************
router.get('/test', (req, res) => {
  res.send('hello world SIR 222')
})

// ********************** Find All Users **********************
router.get('/',controller.fetchAllUsers)

// ********************** Find key by ID **********************
router.get('/key',auth, controller.fetchUserPrivateKey)

// ********************** Find user by ID **********************
router.get('/:user_id',auth, controller.fetchUserDetails)

// ********************** Remove user by ID **********************
router.delete('/:user_id',auth, controller.deleteUser)

// ********************** SIGNUP - ADD NEW USER **********************
router.post('/signup',controller.signup)

// ********************** LOGIN - USER **********************
router.post('/signin',controller.signin)

module.exports = router;