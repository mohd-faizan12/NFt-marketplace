const bcrypt = require("bcrypt");
const userschema = require("../db/user");
const axios = require("axios");
const bcrypt = require("bcrypt")
const response = require("../Exception-handeling/Exceptionhandeling");
const { createModulerLogger } = require("../LoggerServices/loggerservices");
const { error } = require("winston");
const logger = createModulerLogger("userServices");
const authUsermodel = require("../db/authUsermodel")
// const jwt = require("jsonwebtoken");
// const Jwtkey = require("../utilities/jwtutilis");

class userServices {
  // async walletConnect(Credential) {
  //   try {
  //     let results = Credential.walletid;
  //     if (!results) {
  //       return response.error_Bad_request("wallet id and privatekey is required");

  //     } 

  //       const data = new userschema({
  //         walletid: Credential.walletid,
  //       });

  //       await data.save();
  //       console.log(data);

  //       const result = await axios({
  //         method: "post",
  //         url: process.env.PAYMENT_URL, 
  //         data: {
  //           senderAddress: Credential.walletid,
  //           senderPrivateKey: Credential.senderPrivateKey,
  //           amount: 0.001,
  //         },
  //       });

  //       if (result && result.data.result) {
  //         data["txHash"] = result.data.result.TxHash;
  //         data["isverified"] = true;
  //         let final = new userschema(data);
  //         await final.save();
  //         //await EmailServices.sendPaymentMail(userData.Email,"../../Tem/payment.html");
  //         return response.Success(final);
  //       } else {
  //         return response.error_Bad_request("something went wrong");
  //       }

  //   } catch (err) {
  //     console.log("payment status could not be updated", err);
  //     return response.error_Bad_request("payment status could not be updated", err);
  //   }
  // }
  async walletConnect(Credential) {
    try {

      if (!Credential.walletid || !Credential.senderPrivateKey || !Credential.password || !Credential.confirmpassword) {
        return response.error_Bad_request("Please don't leave any field empty");
      }
      const findDb = await authUsermodel.find({ walletId: Credential.walletid })
      if (bcrypt.compareSync(Credential.confirmpassword, findDb.password)){


      }else{
        
      }

        await data.save();
      console.log(data);

      const result = await axios({
        method: "post",
        url: process.env.PAYMENT_URL,
        data: {
          senderAddress: Credential.walletid,
          senderPrivateKey: Credential.senderPrivateKey,
          amount: 0.001,
        },
      });

      if (result && result.data.result) {
        data["txHash"] = result.data.result.TxHash;
        data["isverified"] = true;
        let final = new userschema(data);
        await final.save();
        //await EmailServices.sendPaymentMail(userData.Email,"../../Tem/payment.html");
        return response.Success(final);
      } else {
        return response.error_Bad_request("something went wrong");

      }
    } catch (err) {
      console.log("payment status could not be updated", err);
      return response.error_Bad_request("payment status could not be updated", err);
    }
  }


  //input feilds: walletid,fullname,email,username,password,discord,twitter,bio

  async uploadProfile(Credential) {
    try {
      if (Credential.password) {

        Credential.password = bcrypt.hashSync(
          Credential.password,
          bcrypt.genSaltSync()
        );
      }

      {
        let result = await userschema.updateOne(
          { walletid: Credential.walletid },
          {
            $set: {
              fullname: Credential.fullname,
              email: Credential.email,
              username: Credential.username,
              password: Credential.password,
              discord: Credential.discord,
              twitter: Credential.twitter,
              bio: Credential.bio,
            },
          },
          { upsert: true }
        );
        if (result.modifiedCount || result.upsertedCount) {
          return response.Success("data is successfully added");
        } else {
          return response.error_Bad_request("wallet id not found")
        }
      }
    } catch (err) {
      logger.error("data could not be updated")
      return response.error_Bad_request("data could not be updated", err);
    }
  }
  // async createNft(Credential){
  //  try{
  //  }
  //  catch{
  //  }
  // }
}
module.exports = new userServices();
