import {Application, Request, Response, NextFunction} from 'express';
const jwt = require("jsonwebtoken");

const config = process.env;

export interface UserRequest extends Request {
    user?: string,
}

const verifyToken = (request:UserRequest,response:Response,next:NextFunction) => {
        console.log("TOKEN CHECK :",request.headers);

    const token = 
        request.body.token || request.query.token || request.headers['authorization'];


        if(!token){
            return response.status(403).send({status:{code:400, message:{header:"Token Required",body:"No Token"}}})
        }
        try{
             const decode = jwt.verify(token, config.UNIQUE_USERNAME);
             request.user = decode;
             console.log("DECODED :",decode);
        }catch(error){
            return response.status(401).send({status:{code:400, message:{header:"Invalid Token",body:"Token has expired"}}})
        }
        return next()
}

module.exports = verifyToken;