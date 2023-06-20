
const nftSchema = require("../db/createNftmodel");
const nftcollectionSchema = require("../db/nftCollectionmodel");
const response = require("../Exception-handeling/Exceptionhandeling");
const { createModulerLogger } = require("../LoggerServices/loggerservices")
const logger = createModulerLogger("nftServices");
const Web3 = require("web3");
const compileData = require("../artifacts/contracts/openmartket2.sol/NFTMarketplace.json");



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

    let senderPrivateKey=Credential.senderPrivateKey;

    senderPrivateKey = senderPrivateKey.startsWith("0x")
        ? senderPrivateKey
        : "0x" + senderPrivateKey;
    if (senderPrivateKey.length !== 66) {
        logger.error(
            "privateKey is invalid, Please pass 64 or 66 bits long alpha-numeric string"
        );
        return res
        .status(404)
        .json({
            Error:"owner is invalid, Please pass 40 or 42 bits long alpha-numeric string"
});   }

if(!Credential.recipientAddr)

return res
        .status(404)
        .json({
            Error:"please pass recepient address"})

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
            .transferFrom(account.address,process.env.recipientAddr,Credential.tokenid)
            .encodeABI();
    }

    if (!dataFunction) {
        return res.status(404).json({Error:"please pass all feilds"});
    }
    const count = await web3.eth.getTransactionCount(account.address);

    const createTransaction = await web3.eth.accounts.signTransaction(
        {
            from: account.address,
            nonce: web3.utils.toHex(count),
            gas: web3.utils.toHex(10000000),
            to: Credential.recipientAddr,
            data: dataFunction
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

    return response.Success("final",{...createReceipt,"transactionHash":createReceipt.transactionHash});
    // result1.data.responseArray[0].fileId
  } catch (err) {
    console.log(err);
    logger.error("something went wrong ", err);
    return response.error_Bad_request("something went wrong", err);
  }
}



async getNFTpreview(Credential) {
  try {

      const data = await nftSchema.findOne({walletid:Credential.walletid},
          { amount: 1, supply: 1, externallink: 1, dob: 1, description: 1 });
      return response.Success(data);
  } catch (err) {
      console.log("ids not found ", err);
      return response.error_Bad_request("ids not found ", err);
  }
}










//-------------------------------------------------------------------------





async makeoffer (Credential) {
  try {

  let senderPrivateKey=Credential.senderPrivateKey;

  senderPrivateKey = senderPrivateKey.startsWith("0x")
      ? senderPrivateKey
      : "0x" + senderPrivateKey;
  if (senderPrivateKey.length !== 66) {
      logger.error(
          "privateKey is invalid, Please pass 64 or 66 bits long alpha-numeric string"
      );
      return res
      .status(404)
      .json({
          Error:"owner is invalid, Please pass 40 or 42 bits long alpha-numeric string"
});   }

if(!Credential.recipientAddr)

return res
      .status(404)
      .json({
          Error:"please pass recepient address"})

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
          .transferFrom(account.address,process.env.recipientAddr,Credential.tokenid)
          .send({from:account.address,    gas: web3.utils.toHex(10000000),});
  }
  console.log(dataFunction)

  if (!dataFunction) {
      return res.status(404).json({Error:"please pass all feilds"});
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

  return response.Success("final",{...createReceipt,"transactionHash":createReceipt.transactionHash});
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
              return res
                  .status(404)
                  .json({
                      Error:"owner is invalid, Please pass 40 or 42 bits long alpha-numeric string"
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
          res.status(404).json({ Error: "please pass all feilds correct", message:error.message.toString()});
      }
  }











}
module.exports = new nftServices();
