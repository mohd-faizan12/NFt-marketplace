const bcrypt = require("bcrypt");
const userschema = require("../db/user");
const axios = require("axios");

const response = require("../Exception-handeling/Exceptionhandeling");
const { createModulerLogger } = require("../LoggerServices/loggerservices");
const { error } = require("winston");
const logger = createModulerLogger("userServices");
const authUsermodel = require("../db/authUsermodel")
const jwt = require("jsonwebtoken");
const Jwtkey = require("../utilities/jwtutilis");

const userfollowers = require("../db/userFollowings");
const user = require("../db/user");
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
      if (!(Credential.walletid && Credential.senderPrivateKey)) {
        return response.error_Bad_request("wallet id and privatekey is required");
      } else {
        const data = await userschema.findOne({ walletid: Credential.walletid.toLowerCase() }, { __v: 0 })
        if (data) {
          return response.Already_Occupied_Error("Invalid request: wallet id already exists")
        }


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

          if (Credential.password)
            Credential.password = bcrypt.hashSync(
              Credential.password,
              bcrypt.genSaltSync()
            );

          await userschema.create({
            walletid: Credential.walletid.toLowerCase(),
            txHash: result.data.result.TxHash,
            isverified: true,
            password: Credential.password
          })

          return response.Success("Wallet has verified successfully");
        } else {
          return response.error_Bad_request("something went wrong");
        }
      }
    } catch (err) {

      logger.error(`500: Error Message : ${err}`);
      return response.Internal_Server_Error("payment status could not be updated", err);
    }
  }


  //input feilds: walletid,fullname,email,username,password,discord,twitter,bio

  // async uploadProfile(Credential) {
  //   try {
  //     if (!Credential) {
  //       return response.error_Bad_request("please fill proper bodypayload ");
  //     } else {

  //       const data = await userschema.findOne({ walletid: Credential.walletid.toLowerCase() })
  //       if (!data) {
  //         return response.Not_Found_Error("Invalid request: wallet not Exist");
  //       }



  //       else {
  //         if (Credential.fullname)
  //           data.fullname = Credential.fullname
  //         if (Credential.email)
  //           data.email = Credential.email
  //         if (Credential.username)
  //           data.username = Credential.username


  //         if (Credential.password)
  //           data.password = Credential.password
  //             = bcrypt.hashSync(
  //               Credential.password,
  //               bcrypt.genSaltSync()
  //             );

  //         if (Credential.discord)
  //           data.discord = Credential.discord
  //         if (Credential.twitter)
  //           data.twitter = Credential.twitter
  //         if (Credential.bio)
  //           data.bio = Credential.bio
  //         await data.save();
  //       }
  //     }


  //     return response.Success("Profile  is successfully added");

  //   } catch (err) {
  //     logger.error("data could not be updated")
  //     return response.error_Bad_request("data could not be updated", err);
  //   }
  // }
  async uploadProfile(Credential, authHeader) {
    let finfdb = await user.exists({ username: Credential.username, email: Credential.email });
    if (finfdb) {
      return response.Unauthorized_response("Profile allready exist with given  username and emailAddress !!");
    }
    try {
      Credential.password = Credential.password = bcrypt.hashSync(
        Credential.password,
        bcrypt.genSaltSync()

      );


      const token = authHeader && authHeader.split(' ')[1];
      const decodedPayload = jwt.decode(token);


      const walletfind = await user.findOne({ walletid: decodedPayload.walletid.toLowerCase() })
      if (!walletfind) {
        return response.Not_Found_Error("Invalid request: wallet not Exist");
      }

      const updatedata = await user.updateOne({ walletid: decodedPayload.walletid }, {
        $set: {
          fullname: Credential.fullname,
          email: Credential.email,
          username: Credential.username,
          bio: Credential.bio,
          password: Credential.password,
          discord: Credential.discord,
          twitter: Credential.twitter
        }
      })


      return response.Success("Profile  is successfully added");

    } catch (err) {

      logger.error("data could not be updated")
      return response.error_Bad_request("data could not be updated", err);
    }
  }


  async userLogin(payload) {
    try {
      if (!payload.walletid || !payload.password) {
        return response.error_Bad_request("Please don't leave any field empty");
      }

      let user = await userschema.findOne({ walletid: payload.walletid.toLowerCase() })
      if (!user) {
        return response.Not_Found_Error("Invalid request: wallet not Exist");
      }

      if (bcrypt.compareSync(payload.password, user.password)) {

        const tokendata = {
          walletid: payload.walletid
        };

        let token = jwt.sign(tokendata, Jwtkey.Jwt_Key, {
          algorithm: "HS256",
          expiresIn: "1d",
        });
        let result = await userschema.updateOne(
          { walletid: payload.walletid },
          { $set: { jwttoken: token, isverified: true } },
          { upsert: true }
        );
        return response.Success("Token is generated", { token: token });
      }
      else {
        return response.Not_Found_Error("username or password is incorrect ")
      }
    } catch (error) {
   
      logger.error("user is not create something went to wrong ");
      return response.error_Bad_request("user is not create something went to wrong ");
    }

  }
  async userFollow(objId, targetUserId) {
    try {


      const findData = await userfollowers.find({ follower: objId, followee: targetUserId });

      if (findData.length !== 0) {


        return response.Success({ message: `User ${objId} is allready follow ${targetUserId} ` });
      }
      const doc = {
        follower: objId,
        followee: targetUserId
      }
      const craeteData = await userfollowers.create(doc);


      return response.Success({ message: `User ${objId} is now following ${targetUserId} ` });
    } catch (error) {

      logger.error("message:data could not be updated")
      return response.error_Bad_request("Internal server error", error);
    }
  }
  async userUnFollow(objId, targetUserId) {
    try {



      const deletedata = await userfollowers.findOneAndDelete({ follower: objId, followee: targetUserId });


      logger.info(`200:User is now unfollwing ${targetUserId} `)
      return response.Success({ message: `User ${objId} is now  Unfollowing  ${targetUserId} ` });
    } catch (error) {
     
      logger.error(`500:message:data could not be updated`)
      return response.error_Bad_request("Internal server error", error);
    }
  }
  async countuserfollower(userId) {
    try {
      const result = await userfollowers.find({ followee: userId }).count();
      const results = await userfollowers.find({ follower: userId }).count();
      logger.info(`200:total no. of Follwers  ${result} ,total no of followee ${results}`)
      return response.Success({ message: `Total number of Followers  ${result} ,Total number of followee ${results}`, followers: result, followee: results });

    } catch (error) {

      logger.error(`500:Internal server error`)
      return response.error_Bad_request("Internal server error");
    }
  }
  async GetprofileDetails(pageNumber, limit, authHeader) {
    try {

      const gettoken = authHeader.substr(7);
      const data = await user.findOne({ jwttoken: gettoken },{jwttoken:0,__v:0}).skip(limit * pageNumber).limit(limit).sort({ time: 1 })
      if (!data) {
        response.Not_Found_Error({ message: "Data not found on db" })
      }
      logger.info(`200:profile details  is successfully get`)
      return response.Success({ message: "profile details  is successfully get", data: data })

    } catch (error) {
      logger.error(`500:Something went to wrong`)
      return response.error_Bad_request({ message: "Something went to wrong " })
    }

  }


}
module.exports = new userServices();
