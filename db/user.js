const mongoose = require("mongoose");
const { create } = require("./userFollowings");

const userSchema = new mongoose.Schema({
walletid:{
  type: String,
  lowercase: true,
  trim: true
},
  isverified: {
    type: Boolean,
    default: false
  },
  txHash: String,
  fullname: {
    type: String,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
    
  },
  username: {
    type: String,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    trim: true
  },
  discord: {
    type: String,

  },
  twitter: {
    type: String,
  },
  bio: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: new Date()
},
token: {
  type: String,
  default: ''
}








});

module.exports = mongoose.model("user", userSchema);