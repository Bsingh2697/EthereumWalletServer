import express, {Application, Request, Response, NextFunction} from 'express';
import mongoose from "mongoose"
const controller = require('../../Controller/userController.ts')

const router = express.Router();

const User = require('../../models/UserModel/User')
/*
** Order of routes matter
** If we put "/key" route under "/:user_id" then
** we won't be able to access "/key" route
*/

// ********************** Test API **********************
router.get('/test', (req, res) => {
    let connStr = `${process.env.DB_URL}${process.env.DB_NAME}`
    let uu = process.env.UNIQUE_USERNAME
  res.send(`hello world SIR 222 -  ${connStr} -- ${uu} ---------- ${mongoose.connection.readyState}`,)
})


export interface UserRequest extends Request {
    user : {
        user_id ?: string
    }
}

// ********************** Find All Users **********************
router.get('/',async(request:UserRequest,response:any) => {
    console.log("REQUEST : ",request);
    console.log("REQUEST : ",request?.user);
    console.log("REQUEST PARAM : ",request.params);
    console.log("REQUEST BODY: ",request.body);
    try{
        const users = await User.find()
        response.status(200).send({status:{code:200, message:"Success"},data:{users:users}})
    }
    catch(err){
        response.status(400).send({status:{code:400, message:{header:"Error fetching users",body:err}}})
    }
})

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