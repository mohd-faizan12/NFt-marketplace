const bcrypt = require("bcrypt");
const userschema = require("../db/user");
const axios = require("axios");
const path = require("path");

const response = require("../Exception-handeling/Exceptionhandeling");
const { createModulerLogger } = require("../LoggerServices/loggerservices");
const { error } = require("winston");
const logger = createModulerLogger("userServices");
//const authUsermodel = require("../db/authUsermodel")
const authUsermodel = require("../db/authUsermodel");
const jwt = require("jsonwebtoken");
const Jwtkey = require("../utilities/jwtutilis");
const emailServices = require("../utilities/Emailservices");
const emailSubjects = require("../utilities/emailSubject");
const userfollowers = require("../db/userFollowings");
const user = require("../db/user");

class userServices {
  async user_registration(Credential) {
    try {
      if (!Credential.email || !Credential.password) {
        return response.Unauthorized_response(
          "please Don't leave any empty fields "
        );
      }
      const findEmail = await userschema.findOne({ email: Credential.email });
      if (findEmail) {
        return response.Unauthorized_response(
          "Email Address is Already exist try another one !! "
        );
      }
      Credential.password = bcrypt.hashSync(
        Credential.password,
        bcrypt.genSaltSync(10)
      );

      let results = Credential.email;

      let val = Math.floor(1000 + Math.random() * 9000);
      const data = new userschema({
        email: Credential.email,
        password: Credential.password,
        otp: val,
      });
      await data.save();
      let emailStatus = await emailServices.sendTestMail(
        Credential,
        path.join(__dirname, "../Tem/user-index.html"),
        {
          val,
          Credential,
        },
        emailSubjects.VERIFICATION_OTP
      );
      if (emailStatus) {
        return response.Success("OTP sent to mail for registeration");
      } else {
        await userschema.deleteOne({ email: Credential.email });
        return response.error_Bad_request(
          "Something went wrong while sending email"
        );
      }
    } catch (error) {
      console.log("error", error);
      return response.error_Bad_request("Something wents to wrong ");
    }
  }
  async otp_verification(Credential) {
    try {
      console.log("Credential", Credential);
      if (!Credential.email || !Credential.otp) {
        return response.Unauthorized_response(
          "please Don't leave any empty fields "
        );
      }
      // const findEmail = await user.findOne({ email: Credential.email, opt: Credential.otp });
      const finddata = await userschema.findOne({
        email: Credential.email,
        otp: Credential.otp,
      });
      console.log("findEmail", finddata);
      if (!finddata) {
        return response.Unauthorized_response(
          "Either Email address or otp is invalid"
        );
      }
      finddata.IsOtpVerified = true;
      finddata.otp = null;
      await finddata.save();
      let emailStatus = await emailServices.sendTestMail(
        finddata,
        path.join(__dirname, "../Tem/user-account-create.html"),
        {
          finddata,
        },
        emailSubjects.ACCOUNT_CREATED_SUCCESSFULLY
      );
      if (emailStatus) {
        return response.Success("otp is sucessfully verified");
      } else {
        return response.error_Bad_request(
          "Something went wrong while sending email"
        );
      }
    } catch (error) {
      console.log("error", error);

      return response.error_Bad_request("Your Otp is mismatched");
    }
  }
  async walletConnect(Credential) {
    try {
      if (!Credential.walletid) {
        return response.Unauthorized_response(
          "!! Please enter wallet id on payload"
        );
      }
      if (!Credential.senderPrivateKey) {
        return response.Unauthorized_response(
          "!! Please enter senderPrivateKey on payload"
        );
      }
      if (!Credential.email) {
        return response.Unauthorized_response(
          "!! Please enter  Email on payload"
        );
      }

      const data = await userschema.findOne(
        { walletid: Credential.walletid.toLowerCase(), IsOtpVerified: true },
        { __v: 0 }
      );

      if (data) {
        return response.Already_Occupied_Error(
          "!! wallet id already exists try another one "
        );
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
        const updateDb = await userschema.findOneAndUpdate(
          { email: Credential.email },
          {
            walletid: Credential.walletid,
            txHash: result.data.result.TxHash,
            walletverified: true,
          }
        );
        console.log("updateDb", updateDb);
        if (!updateDb) {
          return response.Unauthorized_response(
            "payment status could not be updated"
          );
        } else {
          let emailStatus = await emailServices.sendTestMail(
            Credential,
            path.join(__dirname, "../Tem/user-wallet-connect.html"),
            {
              data,
            },
            emailSubjects.WALLET_CONNECT__SUCCESSFULLY
          );
          if (emailStatus) {
            return response.Success("wallet is sucessfully connected ");
          } else {
            return response.error_Bad_request(
              "Something went wrong while sending email"
            );
          }
        } // return response.Success({ message: "payment status is  sucessfully  updated", TxHash: result.data.result.TxHash });
      }
    } catch (err) {
      console.log("err", err);
      logger.error(`500: Error Message : ${err}`);
      return response.Internal_Server_Error("something wents to wrong", err);
    }
  }
  async userLogin(payload) {
    try {
      console.log("payload", payload);
      if (!payload.email || !payload.password) {
        return response.error_Bad_request("Please don't leave any field empty");
      }
      const userfind = await userschema.findOne({
        email: payload.email,
        IsOtpVerified: true,
      });
      if (!userfind) {
        return response.error_Bad_request("account is not found");
      }
      console.log("userfind", userfind);
      if (!bcrypt.compareSync(payload.password, userfind.password)) {
        return response.Unauthorized_response("invalid Password ");
      }
      const tokenpayload = {
        Email: payload.Email,
      };
      let token = jwt.sign(tokenpayload, Jwtkey.Jwt_Key, {
        algorithm: "HS256",
        expiresIn: "1d",
      });
      userfind.isverified = true;
      userfind.jwttoken = token;
      await userfind.save();
      return response.Success("Token is generated", { token: token });
    } catch (error) {
      console.log("error", error);
      logger.error("user is not create something went to wrong ");
      return response.error_Bad_request(
        "user is not create something went to wrong "
      );
    }
  }
  async forgot_password(Credential) {
    try {
      if (!Credential.email) {
        return response.Unauthorized_response(
          "please pass email address in payload"
        );
      }

      const data = await userschema.findOne({ email: Credential.email });
      if (!data) {
        return response.Unauthorized_response("data not found");
      }
      let val = Math.floor(1000 + Math.random() * 9000);
      data.otp1 = val;
      await data.save();
      let emailStatus = await emailServices.sendTestMail(
        Credential,
        path.join(__dirname, "../Tem/user-reset-password.html"),
        {
          Credential,
          val,
        },
        emailSubjects.RESET_OTP
      );
      if (emailStatus) {
        return response.Success("OTP sent to mail");
      } else {
        return response.error_Bad_request(
          "Something went wrong while sending email"
        );
      }
    } catch (error) {
      return response.error_Bad_request("something wents to wrong");
    }
  }
  async verifyotpPasschange(Credential) {
    try {
      const data = await userschema.findOne({
        email: Credential.email,
        otp1: Credential.otp,
      });
      console.log("data", data);
      if (!data) {
        return response.Unauthorized_response(
          "Either Email and otp is invalid"
        );
      }
      if (data.otp1 == Credential.otp) {
        data.IsOtpVerified2 = true;
        data.otp1 = null;
        await data.save();
        logger.info(`200 : Message :otp is successfully verified !!`);
        return response.Success("otp is successfully verified !!");
      } else {
        logger.info(`200 :  Message :otp is missmatched`);
        return response.error_Bad_request("otp is missmatched");
      }
    } catch (err) {
      console.log("err", err);
      logger.error(`500 :Error Message :Something wents to wrong`);
      return response.error_Bad_request("Something wents to wrong");
    }
  }
  // async resetpassword(Credential) {
  //   try {
  //     if (!Credential.password || !Credential.email) {
  //       return response.sendError("Please pass correct payload");
  //     }
  //     const data = await userschema.find({ email: Credential.email })
  //     if (!data) {
  //       return response.Unauthorized_response("Email address is not exist on db")
  //     }
  //     if (data.IsOtpVerified2) {
  //       let new_password = bcrypt.hashSync(
  //         Credential.password,
  //         bcrypt.genSaltSync(10));

  //       data.password = new_password;
  //       data.IsOtpVerified2 = null;
  //       data.otp1 = null;
  //       await save()

  //       let emailStatus = await emailServices.sendTestMail(Credential, path.join(__dirname, "../Tem/user-update-password.html"), {
  //         Credential,
  //       },
  //         emailSubjects.RESET_PASSWORD_SUCCESSFULLY
  //       );
  //       if (emailStatus) {
  //         logger.info(`200 : Message :password reset succesfully`);
  //         return response.Success("password reset succesfully");
  //       } else {
  //         logger.info(`200 : Message :Password reset successfully but there is some problem while sending email`);
  //         return response.Success("Password reset successfully but there is some problem while sending email");
  //       }
  //     } else {
  //       logger.info(`200 : Message :either password or email is invalid`);
  //       return response.error_Bad_request("either password or email is invalid");
  //     }
  //   }
  //   catch (error) {
  //     console.log(error)
  //     return response.error_Bad_request("Something wents to wrong")
  //   }
  // }
  async resetpassword(Credential) {
    if (!Credential.password || !Credential.email) {
      return response.sendError("Please pass correct payload");
    }
    try {
      const datafind = await userschema.findOne({ email: Credential.email });

      if (datafind && datafind.IsOtpVerified2) {
        let new_password = bcrypt.hashSync(
          Credential.password,
          bcrypt.genSaltSync(10)
        );
        datafind.password = new_password;
        datafind.IsOtpVerified2 = null;
        datafind.otp1 = null;
        await datafind.save();
        let emailStatus = await emailServices.sendTestMail(
          Credential,
          path.join(__dirname, "../Tem/user-update-password.html"),
          {
            Credential,
          },
          emailSubjects.RESET_PASSWORD_SUCCESSFULLY
        );
        if (emailStatus) {
          logger.info(`200 : Message :password reset succesfully`);
          return response.Success("password reset succesfully");
        } else {
          logger.info(
            `200 : Message :Password reset successfully but there is some problem while sending email`
          );
          return response.Success(
            "Password reset successfully but there is some problem while sending email"
          );
        }
      } else {
        logger.info(`200 : Message :either password or email is invalid`);
        return response.error_Bad_request(
          "either password or email is invalid"
        );
      }
    } catch (err) {
      console.log(err);
      logger.error(`500 : Message :Something wents to wrong`);
      return response.error_Bad_request("Something wents to wrong");
    }
  }
  async update_password(Credential) {
    // token
    try {
      if (!Credential.email) {
        return response.Unauthorized_response(
          "please pass valid Email Address"
        );
      }
      if (!Credential.password) {
        return response.Unauthorized_response(
          "please pass valid correct password"
        );
      }
      if (!Credential.newPassword) {
        return response.Unauthorized_response("please pass new password");
      }
      const datafind = await userschema.findOne({ email: Credential.email });

      if (!datafind) {
        logger.info(`200 : Message :Invalid Email Address`);
        return response.Unauthorized_response("Invalid Email Address");
      } else if (!bcrypt.compareSync(Credential.password, datafind.password)) {
        logger.info(`200 : Message :Incorrect password`);
        return response.error_Bad_request("Incorrect password");
      }
      const new_password = bcrypt.hashSync(
        Credential.newPassword,
        bcrypt.genSaltSync()
      );
      if (bcrypt.compareSync(Credential.newPassword, datafind.password)) {
        logger.info(
          `200 : Message :old passoword and new password  both passwords are same`
        );
        return response.error_Bad_request(
          "old passoword and new password  both passwords are same"
        );
      } else {
        datafind.password = new_password;
        await datafind.save();

        let emailStatus = await emailServices.sendTestMail(
          Credential,
          path.join(__dirname, "../Tem/user-update-password.html"),
          {
            Credential,
          },
          emailSubjects.PASSWORD_UPDATED
        );
        if (emailStatus) {
          logger.info(
            `200 : Message :password has been changed successfully..!`
          );
          return response.Success({
            message: "password has been changed successfully..!",
          });
        } else {
          logger.info(
            `200 : Message :Password reset successfully but there is some problem while sending email`
          );
          return response.Success(
            "Password reset successfully but there is some problem while sending email"
          );
        }
      }
    } catch (err) {
      console.log("err", err);
      logger.error(
        `500 : Error Message :password is not updated Something went to wrong`
      );
      return response.error_Bad_request(
        "password is not updated Something went to wrong"
      );
    }
  }

  async uploadProfile(Credential, authHeader) {
    let finfdb = await user.exists({
      username: Credential.username,
      email: Credential.email,
    });
    if (finfdb) {
      return response.Unauthorized_response(
        "Profile allready exist with given  username and emailAddress !!"
      );
    }
    try {
      Credential.password = Credential.password = bcrypt.hashSync(
        Credential.password,
        bcrypt.genSaltSync()
      );

      const token = authHeader && authHeader.split(" ")[1];
      const decodedPayload = jwt.decode(token);

      const walletfind = await user.findOne({
        walletid: decodedPayload.walletid.toLowerCase(),
      });
      if (!walletfind) {
        return response.Not_Found_Error("Invalid request: wallet not Exist");
      }

      const updatedata = await user.updateOne(
        { walletid: decodedPayload.walletid },
        {
          $set: {
            fullname: Credential.fullname,
            email: Credential.email,
            username: Credential.username,
            bio: Credential.bio,
            password: Credential.password,
            discord: Credential.discord,
            twitter: Credential.twitter,
          },
        }
      );

      return response.Success("Profile  is successfully added");
    } catch (err) {
      logger.error("data could not be updated");
      return response.error_Bad_request("data could not be updated", err);
    }
  }

  async userFollow(objId, targetUserId) {
    try {
      const findData = await userfollowers.find({
        follower: objId,
        followee: targetUserId,
      });

      if (findData.length !== 0) {
        return response.Success({
          message: `User ${objId} is allready follow ${targetUserId} `,
        });
      }
      const doc = {
        follower: objId,
        followee: targetUserId,
      };
      const craeteData = await userfollowers.create(doc);

      logger.info(`200:user now starting following`);
      return response.Success({
        message: `User ${objId} is now following ${targetUserId} `,
      });
    } catch (error) {
      logger.error(`500:message:data could not be updated`);
      return response.error_Bad_request("Internal server error", error);
    }
  }

  async userUnFollow(objId, targetUserId) {
    try {
      const deletedata = await userfollowers.findOneAndDelete({
        follower: objId,
        followee: targetUserId,
      });

      logger.info(`200:User is now unfollwing ${targetUserId} `);
      return response.Success({
        message: `User ${objId} is now  Unfollowing  ${targetUserId} `,
      });
    } catch (error) {
      logger.error(`500:message:data could not be updated`);
      return response.error_Bad_request("Internal server error", error);
    }
  }
  async countuserfollower(userId) {
    try {
      const result = await userfollowers.find({ followee: userId }).count();
      const results = await userfollowers.find({ follower: userId }).count();
      logger.info(
        `200:total no. of Follwers  ${result} ,total no of followee ${results}`
      );
      return response.Success({
        message: `Total number of Followers  ${result} ,Total number of followee ${results}`,
        followers: result,
        followee: results,
      });
    } catch (error) {
      logger.error(`500:Internal server error`);
      return response.error_Bad_request("Internal server error");
    }
  }
  async GetprofileDetails(pageNumber, limit, authHeader) {
    try {
      const gettoken = authHeader.substr(7);
      const data = await user
        .findOne({ jwttoken: gettoken }, { jwttoken: 0, __v: 0 })
        .skip(limit * pageNumber)
        .limit(limit)
        .sort({ time: 1 });
      if (!data) {
        logger.error(`500:Data not found on db`);
        response.Not_Found_Error({ message: "Data not found on db" });
      }
      logger.info(`200:profile details  is successfully get`);
      return response.Success({
        message: "profile details  is successfully get",
        data: data,
      });
    } catch (error) {
      logger.error(`500:Something went to wrong`);
      return response.error_Bad_request({
        message: "Something went to wrong ",
      });
    }
  }

  // async user_registration(Credential) {
  //   try {
  //     if (!Credential.email || !Credential.password) {
  //       return response.Unauthorized_response(
  //         "please Don't leave any empty fields "
  //       );
  //     }
  //     const findEmail = await userschema.findOne({ email: Credential.email });
  //     if (findEmail) {
  //       return response.Unauthorized_response(
  //         "Email Address is Already exist try another one !! "
  //       );
  //     }
  //     Credential.password = bcrypt.hashSync(
  //       Credential.password,
  //       bcrypt.genSaltSync(10)
  //     );

  //     let results = Credential.email;

  //     let val = Math.floor(1000 + Math.random() * 9000);
  //     const data = new userschema({
  //       email: Credential.email,
  //       password: Credential.password,
  //       fullname: Credential.fullname,
  //       otp: val,
  //     });
  //     await data.save();
  //     let emailStatus = await emailServices.sendTestMail(
  //       Credential,
  //       path.join(__dirname, "../Tem/user-index.html"),
  //       {
  //         val,
  //         Credential,
  //       },
  //       emailSubjects.VERIFICATION_OTP
  //     );
  //     if (emailStatus) {
  //       return response.Success("OTP sent to mail for registeration");
  //     } else {
  //       await userschema.deleteOne({ email: Credential.email });
  //       return response.error_Bad_request(
  //         "Something went wrong while sending email"
  //       );
  //     }
  //   } catch (error) {
  //     console.log("error", error);
  //     return response.error_Bad_request("Something wents to wrong ");
  //   }
  // }
}

module.exports = new userServices();
