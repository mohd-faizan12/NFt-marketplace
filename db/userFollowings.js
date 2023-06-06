const mongoose = require("mongoose");

const userfollowerSchema = new mongoose.Schema({




  follower: {
    type: String,
    
  },
  followee: {
    type: String,
   
  },



});

module.exports = mongoose.model("userFollowers", userfollowerSchema);