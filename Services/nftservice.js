
const nftSchema = require("../db/nft");
const collectionSchema = require("../db/nftcollection");
const response = require("../Exception-handeling/Exceptionhandeling");

// const jwt = require("jsonwebtoken");
// const Jwtkey = require("../utilities/jwtutilis");

class nftServices {
  //input feilds : itemname ,supply,blockchain,collection,description,imagehash,thumbnailhash
  async createNft(Credential) {
    try {
      let results = Credential.itemname;
      if (!results) {
        return response.error_Bad_request("item name is required");
      }

      const data = new nftSchema({
        itemname: Credential.itemname,
        Supply: Credential.supply,
        Blockchain: Credential.blockchain,
        Collection: Credential.collection,
        Description: Credential.description,
        Imagehash: Credential.imagehash,
        Thumbnailhash: Credential.thumbnailhash
      });

      await data.save();
      console.log(data);
      return response.Success(["data added"]);




    } catch (err) {
      logger.error("nft not created");
      return response.error_Bad_request("nft not created", err);
    }
  }


  //input feilds:name,url,links,creatorearnings,Blockchain,Description,paymenttoken,category 

  async createNftCollection(Credential) {
    try {


      const data = new collectionSchema({
        name: Credential.name,
        url: Credential.url,
        links: Credential.links,
        creatorearnings: Credential.creatorearnings,
        Blockchain: Credential.Blockchain,
        paymenttoken: Credential.paymenttoken,
        Category: Credential.Category
      });
      await data.save();
      logger.info(data);
      return response.Success(["data added"]);
    } catch (err) {
      logger.error("nft not created", err);
      return response.error_Bad_request("nft not created", err);
    }
  }







}
module.exports = new nftServices();
