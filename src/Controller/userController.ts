import express, {Application, Request, Response, NextFunction} from 'express';
import AES from 'crypto-js/AES';
import CryptoJS from 'crypto-js'
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel/User')
const {registerValidation, loginValidation} = require('../Validation/validation')

export interface UserRequest extends Request {
    user : string
}

exports.fetchAllUsers = async(request:UserRequest,response:Response) => {
    console.log("REQUEST : ",request);
    console.log("REQUEST : ",request?.user);
    console.log("REQUEST PARAM : ",request.params);
    console.log("REQUEST BODY: ",request.body);

    
    try{
        const users = await User.find()
        response.json(users)
    }
    catch(err){
        response.json({message:err})
    }
}
exports.fetchUserDetails = async(request:Request,response:Response) => {
    try{
        const user = await User.findById(request.params.user_id);
        response.json(user);
    }catch(err){
        response.json({message:err})
    }
}

exports.deleteUser = async(request: Request, response:Response, next: NextFunction) => {
    // response.send("WE WANT MY DETAILS"); 
    try{
        const user = await User.remove({_id :request.params.user_id});
        response.json(user);
    }catch(err){
        response.json({message:err})
    }
}

exports.signup =  async(request: Request, response:Response, next: NextFunction) => {

    // === VALIDATING DATA ===
    const {error} = registerValidation(request.body)
    if (error) return response.status(400).send(error.details[0].message)

    let privateKey = request.body.privateKey
    let address = request.body.address
    let username = request.body.username
    let password = request.body.password
    let uniqueKey = process.env.UNIQUE_USERNAME!

    console.log("UQ:",uniqueKey);
    
    const encryptedPRK_uname = AES.encrypt(privateKey,username).toString()
    const encryptedPRK_pwd = AES.encrypt(privateKey,password).toString()
    const encryptedAddress_uname = AES.encrypt(address,username).toString()
    const encryptedAddress_pwd = AES.encrypt(address,password).toString()
    const encryptedUname_pk = AES.encrypt(username,privateKey).toString()
    const encryptedUname_pwd = AES.encrypt(username,password).toString()
    const encryptedPwd_pk = AES.encrypt(password,privateKey).toString()
    const encryptedPwd_uname = AES.encrypt(password,username).toString()
    const uniqueUname = AES.encrypt(username,uniqueKey).toString()

    // === CHECKING IF USERNAME IS UNIQUE OR NOT
    const usernameList = await User.find({},{'_id':0,'unique_user':1})    
    let isUnique = true
    for(var i=0; i<usernameList.length; i++){
        let uname = AES.decrypt(usernameList[i].unique_user,process.env.UNIQUE_USERNAME!).toString(CryptoJS.enc.Utf8)
        console.log("Uname : ",uname);
        console.log("Username : ",username);
        
        if(uname==username){
            isUnique = false
            break;
        }
    }
    if(!isUnique) return response.status(400).send('Already Exists')
    
    // === CREATING USER ===
    const user =  new User({
        private_key_uname: encryptedPRK_uname,
        private_key_pwd: encryptedPRK_pwd,
        address_uname: encryptedAddress_uname,
        address_pwd: encryptedAddress_pwd,
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

    // console.log("ENCRYPTED VALUES");

    // console.log("ENCRYPTED PRIVATE KEY - USER NAME: " + encryptedPK_uname);
    // console.log("ENCRYPTED PRIVATE KEY - PASSWORD: " + encryptedPK_pwd);
    // console.log("ENCRYPTED USERNAME - PRIVATE KEY: " + encryptedUname_pk);
    // console.log("ENCRYPTED USERNAME - PASSWORD: " + encryptedUname_pwd);
    // console.log("ENCRYPTED PASSWORD - PRIVATE KEY: " + encryptedPwd_pk);
    // console.log("ENCRYPTED PASSWORD - USER NAME: " + encryptedPwd_uname);

    // console.log("DECRYPTED VALUES BYTES");
    // const decryptedPK_uname = AES.decrypt(encryptedPK_uname,username)
    // const decryptedPK_pwd = AES.decrypt(encryptedPK_pwd,password)
    // const decryptedUname_pk = AES.decrypt(encryptedUname_pk,privateKey)
    // const decryptedUname_pwd = AES.decrypt(encryptedUname_pwd,password)
    // const decryptedPwd_pk = AES.decrypt(encryptedPwd_pk,privateKey)
    // const decryptedPwd_uname = AES.decrypt(encryptedPK_uname,username)
    
    // console.log("DECRYPTED PRIVATE KEY - USER NAME: " + decryptedPK_uname);
    // console.log("DECRYPTED PRIVATE KEY - PASSWORD: " + decryptedPK_pwd);
    // console.log("DECRYPTED USERNAME - PRIVATE KEY: " + decryptedUname_pk);
    // console.log("DECRYPTED USERNAME - PASSWORD: " + decryptedUname_pwd);
    // console.log("DECRYPTED PASSWORD - PRIVATE KEY: " + decryptedPwd_pk);
    // console.log("DECRYPTED PASSWORD - USER NAME: " + decryptedPwd_uname);

    // console.log("DECRYPTED VALUES ORIGINAL TEXT");
    // const decryptedPK_uname_OG = decryptedPK_uname.toString(CryptoJS.enc.Utf8)
    // const decryptedPK_pwd_OG = decryptedPK_pwd.toString(CryptoJS.enc.Utf8)
    // const decryptedUname_pk_OG = decryptedUname_pk.toString(CryptoJS.enc.Utf8)
    // const decryptedUname_pwd_OG = decryptedUname_pwd.toString(CryptoJS.enc.Utf8)
    // const decryptedPwd_pk_OG = decryptedPwd_pk.toString(CryptoJS.enc.Utf8)
    // const decryptedPwd_uname_OG = decryptedPwd_uname.toString(CryptoJS.enc.Utf8)

    // console.log("OG - DECRYPTED PRIVATE KEY - USER NAME: " + decryptedPK_uname_OG);
    // console.log("OG - DECRYPTED PRIVATE KEY - PASSWORD: " + decryptedPK_pwd_OG);
    // console.log("OG - DECRYPTED USERNAME - PRIVATE KEY: " + decryptedUname_pk_OG);
    // console.log("OG - DECRYPTED USERNAME - PASSWORD: " + decryptedUname_pwd_OG);
    // console.log("OG - DECRYPTED PASSWORD - PRIVATE KEY: " + decryptedPwd_pk_OG);
    // console.log("OG - DECRYPTED PASSWORD - USER NAME: " + decryptedPwd_uname_OG);   
}

exports.signin = async(request: Request, response:Response, next: NextFunction) => {
    
    // === VALIDATING DATA ===
    const {error} = loginValidation(request.body)
    if (error) return response.status(400).send(error.details[0].message)

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
            uname = AES.decrypt(usersList[i].username_pwd,password).toString(CryptoJS.enc.Utf8)
            pwd = AES.decrypt(usersList[i].password_uname,username).toString(CryptoJS.enc.Utf8)
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
            let address = AES.decrypt(res[0]?.address_uname,username).toString(CryptoJS.enc.Utf8)
            return response.status(200).send({status:{code:200, message:"Success"},data:{user:{user_id: res[0]._id,address: address},token:token}})
    }
   ).catch((error) => {
        return response.status(400).send({status:{code:400, message:{header:"Invalid Credentials",body:"Please try with correct credentials"}}})
    })}
    catch (error) {
        return response.status(400).send({status:{code:400, message:{header:"Invalid Credentials",body:"Please try with correct credentials"}}})
    }
}