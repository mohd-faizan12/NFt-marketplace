const bcrypt = require("bcrypt");
const userschema = require("../db/user");
const axios = require("axios");


const response = require("../Exception-handeling/response");

// const jwt = require("jsonwebtoken");
// const Jwtkey = require("../utilities/jwtutilis");

class userServices {
  //input feilds : walllet id and privatekey
  async walletConnect(Credential) {
    try {
      let results = Credential.walletid;
      if (!results) {
        throw new Error("wallet id and privatekey is required");
      }

      const data = new userschema({
        walletid: Credential.walletid,
      });

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
        return response.sendSuccess(final);
      } else {
        return response.sendError("something went wrong");
      }
    } catch (err) {
      console.log("payment status could not be updated", err);
      return response.sendError("payment status could not be updated", err);
    }
  }
  
   //input feilds: walletid,fullname,email,username,password,discord,twitter,bio
    
  async uploadProfile(Credential) {
    try {
        if (Credential.password){

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
            return response.sendSuccess("data added");
        } else {
            return response.sendError("wallet id not found")
        }
      }
    } catch (err) {
      console.log("data could not be updated ", err);
      return response.sendError("data could not be updated", err);
    } 
  }
  async createNft(Credential){
   try{
   }
   catch{
   }
  }
}
module.exports = new userServices();
