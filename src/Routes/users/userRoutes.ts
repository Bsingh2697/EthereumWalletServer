import express, {Application, Request, Response, NextFunction} from 'express';

const controller = require('../../Controller/userController.ts')

const router = express.Router();

/*
** Order of routes matter
** If we put "/key" route under "/:user_id" then
** we won't be able to access "/key" route
*/

// ********************** Test API **********************
router.get('/test', (req, res) => {
    let connStr = `${process.env.DB_URL}${process.env.DB_NAME}`
    let uu = process.env.UNIQUE_USERNAME
  res.send(`hello world SIR 222 -  ${connStr} -- ${uu}`,)
})

// ********************** Find All Users **********************
router.get('/',controller.fetchAllUsers)

// // ********************** Find key by ID **********************
// router.get('/key',auth, controller.fetchUserPrivateKey)

// // ********************** Find user by ID **********************
// router.get('/:user_id',auth, controller.fetchUserDetails)

// // ********************** Remove user by ID **********************
// router.delete('/:user_id',auth, controller.deleteUser)

// // ********************** SIGNUP - ADD NEW USER **********************
// router.post('/signup',controller.signup)

// // ********************** LOGIN - USER **********************
// router.post('/signin',controller.signin)

module.exports = router;