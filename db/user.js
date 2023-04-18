const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  walletid: {
    type: String,
     require: true,
    //unique: true,
  },
  isverified : {
    type:Boolean,
    default:false
  },
  txhash: String,
  fullname: {
    type: String,
    lowercase:true,
    trim:true
  },
  email: {
    type:String,
    lowercase:true,
    unique: true,
    trim:true
  },
  username: {
    type:String,
    lowercase:true,
    unique: true,
    trim:true
  },
  password: {
    type:String,
    trim:true
  },
  discord:String ,
  twitter:String,
  bio:String ,

  token: {
    type: String,
    default: ''
  },
  otp:String,

  

});

module.exports = mongoose.model("user", userSchema);