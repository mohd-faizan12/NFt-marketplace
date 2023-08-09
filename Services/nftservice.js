const nftSchema = require("../db/createNftmodel");
const nftcollectionSchema = require("../db/nftCollectionmodel");
const response = require("../Exception-handeling/Exceptionhandeling");
const { createModulerLogger } = require("../LoggerServices/loggerservices");
const logger = createModulerLogger("nftServices");
const Web3 = require("web3");
const compileData = require("../artifacts/contracts/openmartket2.sol/NFTMarketplace.json");
const userSchema = require("../db/user");
const listingSchema = require("../db/listNftModel");
const { default: mongoose } = require("mongoose");
const nftOfferModel = require("../db/nftOfferModel");
const followSchema = require("../db/userFollowings");
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

  // async createNft(Credential) {
  //   try {
  //     if (Credential.itemname == null|| Credential.supply == null || Credential.blockchain==null) {

  //       return response.error_Bad_request("Please don't leave any field empty");
  //     }
  //     const findCollectionname= await nftcollectionSchema.findOne({})
  //     const body = {
  //       collection: Credential.name

  //     }
  //     const db = new nftcollectionSchema(body);
  //     await db.save()

  //     const dataCreate = await nftSchema.create(Credential);
  //     logger.info("NFT is successfully created")
  //     return response.Success("NFT is successfully created");

  //   } catch (err) {
  //     console.log(err)
  //     logger.error("nft is not created something went to wrong");
  //     return response.error_Bad_request("nft is not created something went to wrong", err);
  //   }
  // }

  async createNftCollection(Credential) {
    try {
      if (
        !Credential.name ||
        !Credential.logoImage ||
        !Credential.bannerImage
      ) {
        return response.error_Bad_request("Please pass required fields");
      }
      const data = new nftcollectionSchema({
        name: Credential.name,
        url: Credential.url,
        description: Credential.description,
        category: Credential.category,
        links: Credential.links,
        creatorEarnings: Credential.creatorEarnings,
        blockchain: Credential.blockchain,
        paymentToken: Credential.paymentToken,
        logoImage: Credential.logoImage,
        bannerImage: Credential.bannerImage,
        walletId: Credential.walletId,
      });
      await data.save();
      logger.info(data);
      return response.Success("data added");
    } catch (err) {
      logger.error("nft not created", err);
      return response.error_Bad_request("nft not created" + err);
    }
  }

  // async createNftCollection(Credential) {
  //   try {
  //     if (Credential.name == null || Credential.url == null) {
  //       return response.error_Bad_request("Please don't leave any field empty");

  //     }

  //     const dataSave = await nftcollectionSchema.create(Credential);
  //     logger.info("Create NFT Collection is successfully")
  //     return response.Success(["Create NFT Collection is successfully"]);
  //   } catch (err) {
  //     console.log("error", err)
  //     logger.error("NFT collection is not create Somthing wants to wrong");
  //     return response.error_Bad_request("NFT collection is not create Somthing wants to wrong", err);
  //   }
  // }

  /*have to take nft id from query params for the token id
 replace the receipent adress after discussion 
*/

  async directSale(Credential) {
    try {
      let senderPrivateKey = Credential.senderPrivateKey;

      senderPrivateKey = senderPrivateKey.startsWith("0x")
        ? senderPrivateKey
        : "0x" + senderPrivateKey;
      if (senderPrivateKey.length !== 66) {
        logger.error(
          "privateKey is invalid, Please pass 64 or 66 bits long alpha-numeric string"
        );
        return res.status(404).json({
          Error:
            "owner is invalid, Please pass 40 or 42 bits long alpha-numeric string",
        });
      }

      if (!Credential.recipientAddr)
        return res.status(404).json({
          Error: "please pass recepient address",
        });

      const web3 = await new Web3(
        "https://testnet.ethrpc.pandoproject.org/rpc"
      );
      logger.info(
        `200 : Web3 connection with Blockchain has built successfully`
      );
      const account = await web3.eth.accounts.wallet.add(senderPrivateKey);
      logger.info(`200 : Account address : ${account.address}`);

      let abi = compileData.abi;
      const contract = await new web3.eth.Contract(
        abi,
        process.env.Contract_Adress
      );
      let dataFunction;
      if (process.env.recipientAddr) {
        dataFunction = contract.methods
          .transferFrom(
            account.address,
            process.env.recipientAddr,
            Credential.tokenid
          )
          .encodeABI();
      }

      if (!dataFunction) {
        return res.status(404).json({ Error: "please pass all feilds" });
      }
      const count = await web3.eth.getTransactionCount(account.address);

      const createTransaction = await web3.eth.accounts.signTransaction(
        {
          from: account.address,
          nonce: web3.utils.toHex(count),
          gas: web3.utils.toHex(10000000),
          to: Credential.recipientAddr,
          data: dataFunction,
        },
        senderPrivateKey
      );

      // Deploy transaction
      const createReceipt = await web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
      );

      logger.info(
        `Transaction successful with hash: ${createReceipt.transactionHash}`
      );
      logger.info(
        `Transaction details: ${JSON.stringify(createReceipt, null, "  ")}`
      );

      return response.Success("final", {
        ...createReceipt,
        transactionHash: createReceipt.transactionHash,
      });
      // result1.data.responseArray[0].fileId
    } catch (err) {
      console.log(err);
      logger.error("something went wrong ", err);
      return response.error_Bad_request("something went wrong", err);
    }
  }

  async getNFTpreview(Credential) {
    try {
      const data = await nftSchema.findOne(
        { walletid: Credential.walletid },
        { amount: 1, supply: 1, externallink: 1, dob: 1, description: 1 }
      );
      return response.Success(data);
    } catch (err) {
      console.log("ids not found ", err);
      return response.error_Bad_request("ids not found ", err);
    }
  }

  //----------------------------------------------------------------------------------

  async makeoffer(Credential) {
    try {
      let senderPrivateKey = Credential.senderPrivateKey;

      senderPrivateKey = senderPrivateKey.startsWith("0x")
        ? senderPrivateKey
        : "0x" + senderPrivateKey;
      if (senderPrivateKey.length !== 66) {
        logger.error(
          "privateKey is invalid, Please pass 64 or 66 bits long alpha-numeric string"
        );
        return res.status(404).json({
          Error:
            "owner is invalid, Please pass 40 or 42 bits long alpha-numeric string",
        });
      }

      if (!Credential.recipientAddr)
        return res.status(404).json({
          Error: "please pass recepient address",
        });

      const web3 = await new Web3(
        "https://testnet.ethrpc.pandoproject.org/rpc"
      );
      logger.info(
        `200 : Web3 connection with Blockchain has built successfully`
      );
      const account = await web3.eth.accounts.wallet.add(senderPrivateKey);
      logger.info(`200 : Account address : ${account.address}`);

      let abi = compileData.abi;
      const contract = await new web3.eth.Contract(
        abi,
        process.env.Contract_Adress
      );
      let dataFunction;
      if (process.env.recipientAddr) {
        dataFunction = contract.methods
          .transferFrom(
            account.address,
            process.env.recipientAddr,
            Credential.tokenid
          )
          .send({ from: account.address, gas: web3.utils.toHex(10000000) });
      }
      console.log(dataFunction);

      if (!dataFunction) {
        return res.status(404).json({ Error: "please pass all feilds" });
      }
      const count = await web3.eth.getTransactionCount(account.address);

      // const createTransaction = await web3.eth.accounts.signTransaction(
      //     {
      //         from: account.address,
      //         nonce: web3.utils.toHex(count),
      //         gas: web3.utils.toHex(10000000),
      //         to: Credential.recipientAddr,
      //         data: dataFunction
      //     },
      //     senderPrivateKey
      // );

      // Deploy transaction
      const createReceipt = await web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
      );

      logger.info(
        `Transaction successful with hash: ${createReceipt.transactionHash}`
      );
      logger.info(
        `Transaction details: ${JSON.stringify(createReceipt, null, "  ")}`
      );

      return response.Success("final", {
        ...createReceipt,
        transactionHash: createReceipt.transactionHash,
      });
      // result1.data.responseArray[0].fileId
    } catch (err) {
      console.log(err);
      logger.error("something went wrong ", err);
      return response.error_Bad_request("something went wrong", err);
    }
  }

  /**
   * @author vishal mendiratta
   * @param {string} owner who has deploy the smart contract or has owner of particular supply of token
   * @returns {number, string, boolean} return particular type of data
   */
  async balanceOfac(req, res) {
    try {
      let { owner } = req.query;
      owner = owner.startsWith("0x") ? owner : "0x" + owner;
      if (owner.length !== 42) {
        logger.error(
          "owner is invalid, Please pass 40 or 42 bits long alpha-numeric string"
        );
        return res.status(404).json({
          Error:
            "owner is invalid, Please pass 40 or 42 bits long alpha-numeric string",
        });
      }
      const web3 = await new Web3(
        "https://testnet.ethrpc.pandoproject.org/rpc"
      );
      logger.info(
        `200 : Web3 connection with Blockchain has built successfully`
      );
      // const account = await web3.eth.accounts.wallet.add(`0x${process.env.PRIVATE_KEY}`);
      // logger.info(`200 : Account address : ${account.address}`);
      let abi = compileData.abi;
      const contract = await new web3.eth.Contract(
        abi,
        process.env.Contract_Adress
      );
      let result;

      if (owner) {
        result = await contract.methods.balanceOf(owner).call();
        console.log(result);
      }

      if (!result) {
        return res.status(404).send("please pass all feilds");
      }
      let resultString = `Contract call for balanceof and result is `;
      res.json({ resultString, result });
    } catch (error) {
      logger.error(`404: error: ${error.message}`);
      res.status(404).json({
        Error: "please pass all feilds correct",
        message: error.message.toString(),
      });
    }
  }

  async latest_Drops() {
    try {
      const data = await nftSchema.find({}).sort({ created_at: -1 });
      if (!data.length) {
        return response.error("DB is empty");
      } else {
        return response.Success(data);
      }
    } catch (err) {
      console.log("error :", err);
      return response.error("error while fetching data :", err);
    }
  }
  async userLatest_Drops(Credential) {
    try {
      // const token = Credential.substr(7);
      // const datas = await userSchema.findOne({ jwttoken: token });
      const addr = Credential;
      if (!addr) {
        return response.error_Bad_request("Wallet id could not be found");
      }

      let data = await nftSchema.find({}).sort({ created_at: -1 });
      let ndata = data.map((item) => {
        return { ...item._doc };
      });
      ndata.forEach((element) => {
        if (element.walletid == addr) {
          element["userData"] = true;
        } else {
          element["userData"] = false;
        }
      });
      return response.Success(ndata);
    } catch (err) {
      console.log("error :", err);
      return response.error("error while fetching data :", err);
    }
  }
  async topCollection() {
    try {
      const data = await nftcollectionSchema.aggregate([
        {
          $group: {
            _id: "$name",
            count: {
              $sum: 1,
            },
            data: {
              $push: {
                url: "$url",
                links: "$links",
                creatorearnings: "$creatorearnings",
              },
            },
          },
        },
      ]);
      return response.Success("data :", data);
    } catch (error) {
      console.log("error :", error);
      return response.error("error while fetching data :", error);
    }
  }
  async get_All_Nft() {
    try {
      const data = await nftSchema.find({}).sort({ created_at: -1 });
      return response.Success(data);
    } catch (error) {
      console.log("error :", error);
      return response.error("error while fetching data :", error);
    }
  }
  async userGet_All_Nft(Credential) {
    try {
      const addr = Credential;
      const data = await nftSchema.find({}).sort({ created_at: -1 });
      let ndata = data.map((item) => {
        return { ...item._doc };
      });
      ndata.forEach((element) => {
        if (element.walletid == addr) {
          element["userData"] = true;
        } else {
          element["userData"] = false;
        }
      });
      return response.Success(ndata);
    } catch (error) {
      console.log("error :", error);
      return response.error("error while fetching data :", error);
    }
  }
  async deleteNft(Credential) {
    try {
      const items = await nftSchema.findOne({ itemname: Credential });
      if (!items) {
        return response.Not_Found_Error("No nft found with such item name");
      }
      const listed = await listingSchema.findOne({ itemname: Credential });
      if (listed) {
        return response.error_Bad_request(
          "Nft could not be deleted as it is already listed on sell "
        );
      }
      const data = await nftSchema.deleteOne({ itemname: Credential });
      return response.Success(data);
    } catch (error) {
      console.log("error :", error);
      return response.error("error while deleting data :", error);
    }
  }

  async ListNft(Credential) {
    try {
      if (Credential.type != "Fixed" && Credential.type != "Duration") {
        return response.error("Type is not valid");
      }
      if (
        !Credential.itemname ||
        !Credential.type ||
        !Credential.creator ||
        !Credential.amount
      ) {
        return response.error("Please pass all required fields");
      }
      const data = await nftSchema.findOne({ itemname: Credential.itemname });
      if (!data) {
        return response.error("Please list a valid nft");
      }
      const datas = new listingSchema({
        itemname: Credential.itemname,
        creator: Credential.creator,
        Url: Credential.url,
        listingType: Credential.type,
        nftPrice: Credential.amount,
        creatorFee: Credential.creatorFee,
        serviceFee: Credential.serviceFee,
        duration: null,
      });
      await datas.save();
      data.isListed = true;
      await data.save();
      if (Credential.type == "Duration") {
        datas.duration = Credential.duration;
        await datas.save();
      }
      return response.Success("Nft listed");
    } catch (error) {
      console.log("error :", error);
      return response.error("error while listing nft :", error);
    }
  }
  async collectionList() {
    try {
      const data = await nftcollectionSchema
        .find({}, { name: 1 })
        .sort({ createdAt: -1 });
      return response.Success(data);
    } catch (error) {
      console.log("error :", error);
      return response.error("error getting collection list :", error);
    }
  }
  async my_collection(Credential) {
    try {
      const data = await nftcollectionSchema.find({ walletId: Credential });
      if (data.length == 0) {
        return response.Not_Found_Error("No collection found");
      }
      return response.Success(data);
    } catch (error) {
      console.log("error :", error);
      return response.error("error getting collection list :", error);
    }
  }
  async collection_Preview(Credential) {
    try {
      const data = await nftSchema.find({ nftcollection: Credential });
      if (data.length == 0) {
        return response.Not_Found_Error("No collection found");
      }
      return response.Success(data);
    } catch (error) {
      console.log("error :", error);
      return response.error("error getting collection list :", error);
    }
  }
  async nft_Details(Credential) {
    try {
      const data = await nftSchema.find({ itemname: Credential });
      if (data.length == 0) {
        return response.Not_Found_Error("No collection found");
      }
      return response.Success(data);
    } catch (error) {
      console.log("error :", error);
      return response.error("error getting collection list :", error);
    }
  }

  async make_AnOffer(data, userData) {
    try {
      const user = userData;
      if (!user || !data.itemname || !data.offeredAmount) {
        return response.error_Bad_request("Please pass all required fields");
      }
      const findNFT = await nftSchema.findOne({ itemname: data.itemname });
      if (!findNFT) {
        return response.Not_Found_Error("No NFT found with such item name");
      }
      const details = {
        name: userData.fullname,
        email: userData.email,
        walletId: userData.walletid,
      };
      const datas = new nftOfferModel({
        itemname: data.itemname,
        offeredAmount: data.offeredAmount,
        duration: data.offerDuration,
        offeredBy: details,
      });
      await datas.save();
      return response.Success("Offer made successfully");
    } catch (error) {
      console.log("error :", error);
      return response.error("error making an offer :", error);
    }
  }

  async profile_Details(Credential) {
    try {
      const details = {
        _id: Credential._id,
        name: Credential.fullname || null,
        walletId: Credential.walletid || null,
        bio: Credential.bio || null,
        links: {
          discord: Credential.discord || null,
          twitter: Credential.twitter || null,
        },
      };
      return response.Success(details);
    } catch (error) {
      console.log("error :", error);
      return response.error("error getting collection list :", error);
    }
  }
  async user_NFTs(Credential, query) {
    try {
      let data;
      if (query.collection || query.Listed) {
        if (query.colletcion) {
          data = await nftSchema.find({
            walletid: Credential,
            nftcollection: query.colletcion,
          });
        } else if (query.Listed) {
          data = await nftSchema.find({
            walletid: Credential,
            isListed: true,
          });
        }
      } else {
        data = await nftSchema.find({ walletid: Credential });
      }
      return response.Success(data);
    } catch (error) {
      console.log("error :", error);
      return response.error("error getting collection list :", error);
    }
  }
  async NFTs_Offer(Credential) {
    try {
      if (!Credential) {
        return response.error_Bad_request("Please item name");
      }
      const data = await nftOfferModel.find({ itemname: Credential });
      if (data.length == 0) {
        return response.Not_Found_Error("No offer made yet ");
      }
      return response.Success(data);
    } catch (error) {
      console.log("error :", error);
      return response.error("error getting collection list :", error);
    }
  }

  async user_ProfileDetails(Credential) {
    try {
      let data = await userSchema.findOne(
        { _id: Credential },
        {
          walletid: 1,
          fullname: 1,
          email: 1,
          username: 1,
          discord: 1,
          twitter: 1,
          bio: 1,
        }
      );
      const followers = await followSchema.aggregate([
        {
          $match: { followee: Credential },
        },
        {
          $group: {
            _id: null,
            count: {
              $sum: 1,
            },
          },
        },
      ]);
      let finalData = JSON.parse(JSON.stringify(data));
      finalData["followersCount"] = followers[0].count;
      return response.Success(finalData);
    } catch (error) {
      console.log("error :", error);
      return response.error("error getting collection list :", error);
    }
  }
}
module.exports = new nftServices();
