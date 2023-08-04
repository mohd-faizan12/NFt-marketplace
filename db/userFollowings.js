const mongoose = require("mongoose");

const userfollowerSchema = new mongoose.Schema({
  followee: {
    type: String,
  },
  follower: {
    type: String,
  },
});

module.exports = mongoose.model("userFollowers", userfollowerSchema);
