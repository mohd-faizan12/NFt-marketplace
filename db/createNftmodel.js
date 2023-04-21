const mongoose = require("mongoose");

const nft_Schema = new mongoose.Schema({
  itemname: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  Supply: {
    type: Number,
    require: true,
    trim: true
  },
  Blockchain: {
    type: String,
    lowercase: true,
    trim: true,
    require: true
  },
  Collection:
    String,

  Externallink: {
    type: String,
  },

  Description: String,

  Imagehash: String,
  Thumbnailhash: String,

});

module.exports = mongoose.model("createNft", nft_Schema);