
const nftSchema = require("../db/createNftmodel");
const nftcollectionSchema = require("../db/nftCollectionmodel");
const response = require("../Exception-handeling/Exceptionhandeling");
const { createModulerLogger } = require("../LoggerServices/loggerservices")
const logger = createModulerLogger("nftServices");


// const jwt = require("jsonwebtoken");
// const Jwtkey = require("../utilities/jwtutilis");

class nftServices {
  //input feilds : itemname ,supply,blockchain,collection,description,imagehash,thumbnailhash
  // async createNft(Credential) {
  //   try {
  //     let results = Credential.itemname;
  //     if (!results) {
  //       return response.error_Bad_request("item name is required");
  //     }

  //     const data = new nftSchema({
  //       itemname: Credential.itemname,
  //       Supply: Credential.supply,
  //       Blockchain: Credential.blockchain,
  //       Collection: Credential.collection,
  //       Description: Credential.description,
  //       Imagehash: Credential.imagehash,
  //       Thumbnailhash: Credential.thumbnailhash
  //     });

  //     await data.save();
  //     console.log(data);
  //     return response.Success(["data added"]);




  //   } catch (err) {
  //     logger.error("nft not created");
  //     return response.error_Bad_request("nft not created", err);
  //   }
  // }


  async createNft(Credential) {
    try {
      if (Credential.itemname == null|| Credential.supply == null || Credential.blockchain==null) {
      
        return response.error_Bad_request("Please don't leave any field empty");
      }
      const findCollectionname= await nftcollectionSchema.findOne({})
      const body = {
        collection: Credential.name

      }
      const db = new nftcollectionSchema(body);
      await db.save()

      const dataCreate = await nftSchema.create(Credential);
      logger.info("NFT is successfully created")
      return response.Success("NFT is successfully created");

    } catch (err) {
      console.log(err)
      logger.error("nft is not created something went to wrong");
      return response.error_Bad_request("nft is not created something went to wrong", err);
    }
  }



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

  async createNftCollection(Credential) {
    try {
      if (Credential.name == null || Credential.url == null) {
        return response.error_Bad_request("Please don't leave any field empty");

      }
     
      const dataSave = await nftcollectionSchema.create(Credential);
      logger.info("Create NFT Collection is successfully")
      return response.Success(["Create NFT Collection is successfully"]);
    } catch (err) {
      console.log("error", err)
      logger.error("NFT collection is not create Somthing wants to wrong");
      return response.error_Bad_request("NFT collection is not create Somthing wants to wrong", err);
    }
  }







}
module.exports = new nftServices();
