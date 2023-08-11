const mongoose = require("mongoose");

const list_Schema = new mongoose.Schema({
  itemname: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  thumbnailhash: {
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
});

module.exports = mongoose.model("ListingNftCollection", list_Schema);
