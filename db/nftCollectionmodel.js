const mongoose = require("mongoose");

const Collection_Schema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
    trim: true,
  },
  url: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  links: [
    {
      website: {
        type: String,
      },
      medium: {
        type: String,
      },
      telegram: {
        type: String,
      },
    },
  ],

  creatorEarnings: {
    type: String,
    trim: true,
  },
  blockchain: {
    type: String,
  },

  paymentToken: {
    type: String,
  },

  // validate: (value) => {
  //   return ["Popular", "Arts", "Games","Music","Sports","Photography","Virtualland","Fashion"].includes(value);
  // },

  createdAt: {
    type: Date,
    default: new Date(),
  },
  logoImage: {
    type: String,
    require: true,
  },
  bannerImage: {
    type: String,
    require: true,
  },
  walletId: {
    type: String,
    require: true,
    trim: true,
  },
  Creator: {
    type: String,
    require: true,
    trim: true,
  },
});

module.exports = mongoose.model("CollectionNft", Collection_Schema);
