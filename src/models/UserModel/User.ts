import { COLLECTION_CONSTANTS } from "../../utils/constants/CollectionConstants"

const mongoose = require('mongoose')

// ****************** Schema ******************
// SCHEMA REPRESENTS HOW THAT DATA LOOKS

const UserSchema = mongoose.Schema({
     private_key_uname:{
        type: String,
        required: true,
     },
     private_key_pwd:{
        type: String,
        required: true,
     },
     username_pk:{
        type: String,
        required: true,
     },
     username_pwd:{
        type: String,
        required: true,
     },
     password_pk:{
        type: String,
        required: true,
     },
     password_uname:{
        type: String,
        required: true,
     },
     unique_user:{
      type: String,
      required: true
     },
     address_uname:{
      type: String,
      required: true
     },
     address_pwd:{
      type: String,
      required: true
     }
})

// ****************** Name inside model is the name of collection which will be created ******************
module.exports = mongoose.model(COLLECTION_CONSTANTS.USERS,UserSchema)