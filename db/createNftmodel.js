// const { string } = require("hardhat/internal/core/params/argumentTypes");
const mongoose = require("mongoose");

const nft_Schema = new mongoose.Schema({
  itemname: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  supply: {
    type: Number,
    require: true,
    trim: true,
  },
  blockchain: {
    type: String,
    lowercase: true,
    trim: true,
    require: true,
  },
  nftcollection: String,

  externallink: {
    type: String,
  },

  walletid: {
    type: String,
    lowercase: true,
    trim: true,
  },
  amount: Number,
  transactionHash: String,

  description: String,

  videohash: String,
  thumbnailhash: String,
  tokenId: Number,
  Creator: {
    type: String,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("createNft", nft_Schema);
