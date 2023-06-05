const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({


  username: {
    type: String,
    lowercase: true,
    unique: true,
    trim: true
  },


  followingCount: {
    type: Number,
    default: 0
  }



});

module.exports = mongoose.model("userFollowers", userFollowingSchema);