const mongoose = require("mongoose");

const Offer_Schema = new mongoose.Schema({
  itemname: {
    type: String,
    require: true,
    trim: true,
  },
  offeredAmount: {
    type: Number,
  },
  duration: {
    type: String,
  },
  madeAt: {
    type: Date,
    default: new Date(),
  },
  offeredBy: [
    {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      walletId: {
        type: String,
      },
    },
  ],
});

module.exports = new mongoose.model("NftOfferCollection", Offer_Schema);
