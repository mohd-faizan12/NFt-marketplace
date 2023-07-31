const mongoose = require("mongoose");

const list_Schema = new mongoose.Schema({
  itemname: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  creator: {
    type: String,
    trim: true,
  },
  Url: {
    type: String,
  },
  listingType: {
    type: String,
  },
  nftPrice: {
    type: Number,
  },
  duration: [
    {
      from: {
        type: String,
      },
      to: {
        type: String,
      },
    },
  ],
  creatorFee: {
    type: String,
  },
  serviceFee: {
    type: String,
  },
});

module.exports = mongoose.model("ListingNftCollection", list_Schema);
