const mongoose = require("mongoose");

const Collection_Schema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  url: {
    type: String,
    require: true,
    trim: true
  },
  links: {
    // type:Object
    website: String,
    medium: String,
    telegram: String,


  },
  creatorearnings: {
    type: String,
    lowercase: true,
    trim: true
  },
  Blockchain: {
    type: String,
  },

  Description: String,

  paymenttoken: String,
  Category: {
    type: Array,
  }
  // type: Array,

  // validate: (value) => {
  //   return ["Popular", "Arts", "Games","Music","Sports","Photography","Virtualland","Fashion"].includes(value);
  // },
  // trim: true,
  // lowercase: true,


  // Category : [{
  //   lat : String,
  //   lng : String
  //    }]

});

module.exports = mongoose.model("CollectionNft", Collection_Schema);