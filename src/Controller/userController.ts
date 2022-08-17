import express, {Application, Request, Response, NextFunction} from 'express';
import CryptoJS from 'crypto-js'
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel/User')
const {registerValidation, loginValidation} = require('../Validation/validation')

export interface UserRequest extends Request {
    user : {
        user_id ?: string
    }
}


// ********************** FETCH ALL USER ROUTE: "/" **********************
exports.fetchAllUsers = async(request:UserRequest,response:Response) => {
    console.log("REQUEST : ",request);
    console.log("REQUEST : ",request?.user);
    console.log("REQUEST PARAM : ",request.params);
    console.log("REQUEST BODY: ",request.body);
    try{
        const users = await User.find()
        response.send({status:{code:200, message:"Success"},data:{users:"users"}})
    }
    catch(err){
        response.send({status:{code:400, message:{header:"Error fetching users",body:err}}})
    }
}

// ********************** FETCH USER DETAILS ROUTE: "/:user_id" **********************
exports.fetchUserDetails = async(request:Request,response:Response) => {
    try{
        console.log("ID : ",request.params.user_id);
        const user = await User.findById(request.params.user_id);
        const address = CryptoJS.AES.decrypt(user?.address,process.env.UNIQUE_USERNAME!).toString(CryptoJS.enc.Utf8)
        user ? response.status(200).send({status:{code:200, message:"Success"},data:{user : user?._id, address : address}}) :
        response.status(400).send({status:{code:400, message:{header:"Error fetching user details",body:"Unable to find user with the provided ID"}}})
        // data:{user_id: user._id,address: user.address}});
    }catch(err){
        response.status(400).send({status:{code:400, message:{header:"Error fetching user details",body:"Unable to find user details, please try again!"}}})
    }
}

// ********************** FETCH USER PRIVATE KEY: "/key" **********************
exports.fetchUserPrivateKey= async(request:UserRequest,response:Response) => {
    try{
        console.log("request",request?.user)
        const user  = await User.findById(request.user.user_id);
        user ? response.status(200).send({status:{code:200,message:"Success"},data:{key:user?.private_key_pwd}}):
        response.status(400).send({status:{code:400, message:{header:"Error fetching user key",body:"Some error occurred, please try again!"}}})
    }catch(err){
        response.status(400).send({status:{code:400, message:{header:"Error fetching user key",body:"Unable to fetch user key, please try again!"}}})
    }
}

// ********************** DELETE USER ROUTE: "/:user_id" **********************
exports.deleteUser = async(request: Request, response:Response, next: NextFunction) => {
    // response.send("WE WANT MY DETAILS"); 
    try{
        const user = await User.remove({_id :request.params.user_id});
        response.status(200).send({status:{code:200, message:{header:"Success",body:"User has been removed successfully"}}});
    }catch(err){
        response.status(400).send({status:{code:400, message:{header:"Error deleting user",body:"Unable to delete user, please try again!"}}})
    }
}

// ********************** REGISTER USER ROUTE: "/:signup" **********************
exports.signup =  async(request: Request, response:Response, next: NextFunction) => {

    // === VALIDATING DATA ===
    const {error} = registerValidation(request.body)
    if (error) return response.status(400).send({status:{code:400, message:{header:"Validation error",body:error.details[0].message}}})
        

    let privateKey = request.body.privateKey
    let address = request.body.address
    let username = request.body.username
    let password = request.body.password
    let uniqueKey = process.env.UNIQUE_USERNAME!

    console.log("UQ:",uniqueKey);
    
    // PRIVATE KEY
    const encryptedPRK_uname = CryptoJS.AES.encrypt(privateKey,username).toString()
    const encryptedPRK_pwd = CryptoJS.AES.encrypt(privateKey,password).toString()
    // ADDRESS
    const encryptedAddress = CryptoJS.AES.encrypt(address,uniqueKey).toString()
    // USERNAME
    const encryptedUname_pk = CryptoJS.AES.encrypt(username,privateKey).toString()
    const encryptedUname_pwd = CryptoJS.AES.encrypt(username,password).toString()
    // PASSWORD
    const encryptedPwd_pk = CryptoJS.AES.encrypt(password,privateKey).toString()
    const encryptedPwd_uname = CryptoJS.AES.encrypt(password,username).toString()
    // UNIQUENAME
    const uniqueUname = CryptoJS.AES.encrypt(username,uniqueKey).toString()

    // === CHECKING IF USERNAME IS UNIQUE OR NOT
    const usernameList = await User.find({},{'_id':0,'unique_user':1})    
    let isUnique = true
    for(var i=0; i<usernameList.length; i++){
        let uname = CryptoJS.AES.decrypt(usernameList[i].unique_user,process.env.UNIQUE_USERNAME!).toString(CryptoJS.enc.Utf8)
        console.log("Uname : ",uname);
        console.log("Username : ",username);
        
        if(uname==username){
            isUnique = false
            break;
        }
    }
    if(!isUnique) return response.status(400).send({status:{code:400, message:{header:"Username not available",body:"Username already exusts"}}})
    
    // === CREATING USER ===
    const user =  new User({
        private_key_uname: encryptedPRK_uname,
        private_key_pwd: encryptedPRK_pwd,
        address: encryptedAddress,
        username_pk: encryptedUname_pk,
        username_pwd: encryptedUname_pwd,
        password_pk: encryptedPwd_pk,
        password_uname: encryptedPwd_uname,
        unique_user: uniqueUname
    })
    try{
        // create user
        let savedUser = await user.save()
        // create token
        const token = await jwt.sign(
            {user_id: savedUser?._id,},
            uniqueKey,
            { algorithm: 'HS256'},
            { expiresIn : 10000000}
        )
        savedUser.token = token     
        console.log("NEW USER CREATED : ", savedUser);
           
        // WE CAN ACTUALLY JUST SEND BACK TOKEN AND BASED ON THAT PERFORM OPERATIONS
        // NO NEED TO PASS _ID - WE can implement it later        
        return response.status(200).send({status:{code:200, message:"Success"},data:{user:{user_id: savedUser._id._id,address: address},token:token}})

    }
    catch(err){
        response.status(400).json({message:err})
    }
}

// ********************** REGISTER USER ROUTE: "/:signin" **********************
exports.signin = async(request: Request, response:Response, next: NextFunction) => {
    
    // === VALIDATING DATA ===
    const {error} = loginValidation(request.body)
    if (error) return response.status(400).send({status:{code:400, message:{header:"Validation error",body:error.details[0].message}}})

    const username = request.body.username
    const password = request.body.password
    let uniqueKey = process.env.UNIQUE_USERNAME!

    // === USER EXISTS ===
    try{
    const usersList = await User.find({},{'_id':0,'username_pwd':1,'password_uname':1})    

    console.log("USER LIST : ",usersList);
    console.log("USERNAME : ", request.body.username);
    console.log("Password : ", request.body.password);

    
    
    let userData = new Promise(async (resolve, reject )=>{
         for(var i=0; i<usersList.length; i++){
        console.log("USERName PARAMS : ",usersList[i].username_pwd," - ",username);
        console.log("Password PARAMS : ",usersList[i].password_uname," - ",password);
        console.log("TYPE OF USERNAME: ", typeof username);
        console.log("TYPE OF Password: ", typeof password);
        
        let uname;
        let pwd;
             try{
            uname = CryptoJS.AES.decrypt(usersList[i].username_pwd,password).toString(CryptoJS.enc.Utf8)
            pwd = CryptoJS.AES.decrypt(usersList[i].password_uname,username).toString(CryptoJS.enc.Utf8)
        }
        catch(e){
            console.log(e);
            continue;
        }
        console.log("UNAME :",uname);
        console.log("PWD :",pwd);
        

        if(uname == username && pwd == password){
            // console.log("User data Found: ",userData);
            let returnData = await User.find({"$and":[
                    {"username_pwd" : usersList[i].username_pwd},
                    {"password_uname" : usersList[i].password_uname}]},
                    {"unique_user":0})
            console.log("returnData : ",returnData);
            resolve(returnData)
            break;
        }    
     } reject()
    })
   .then(
    async (res:any) => {
        console.log("SUCCESS PROMISE",res)
             const token = await jwt.sign(
            {user_id: res[0]?._id,},
            uniqueKey,
            { algorithm: 'HS256'},
            { expiresIn : 10000000}
        )
            let address = CryptoJS.AES.decrypt(res[0]?.address,process.env.UNIQUE_USERNAME!).toString(CryptoJS.enc.Utf8)
            return response.status(200).send({status:{code:200, message:"Success"},data:{user:{user_id: res[0]._id,address: address},token:token}})
    }
   ).catch((error) => {
        return response.status(400).send({status:{code:400, message:{header:"Invalid Credentials",body:"Please try with correct credentials"}}})
    })}
    catch (error) {
        return response.status(400).send({status:{code:400, message:{header:"Invalid Credentials",body:"Please try with correct credentials"}}})
    }
}