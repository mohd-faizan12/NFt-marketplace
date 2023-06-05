
// const bcrypt = require("bcrypt");
// const authUser = require("../db/authUsermodel");
// const response = require("../Exception-handeling/Exceptionhandeling");
// const { createModulerLogger } = require("../LoggerServices/loggerservices");
// const logger = createModulerLogger("authUser")
// const jwt = require("jsonwebtoken");
// const Jwtkey = require("../utilities/jwtutilis");
// class authServices {

//     async userloginServices(payload) {
//         try {
//             if (!payload.walletid || !payload.password) {
//                 return response.error_Bad_request("Please don't leave any field empty");
//             }
//             let user = await userschema.findOne({ walletid: payload.walletid.toLowerCase() })
                
//             if(user && bcrypt.compareSync(payload.password, user.password)){

//                 const tokendata = {
//                     walletid: payload.walletid
//                 };

//             let token = jwt.sign(tokendata, Jwtkey.Jwt_Key, {
//                 algorithm: "HS256",
//                 expiresIn: "1d",
//             });
//                await tokenschema.updateOne(
//                 { walletid: payload.walletid },
//                 { $set: { jwttoken: token, isActive: true } },
//                 { upsert: true }
//             );
//             if (result.modifiedCount || result.upsertedCount) {
//                 return response.sendSuccess("Token is generated", { token: token});
//             } else {
//                 return response.sendError("User is inactive")
//             }
//         }
//         } catch (error) {
//             logger.error("user is not create something went to wrong ");
//             return response.error_Bad_request("user is not create something went to wrong ");
//         }
//     }
// }
// module.exports = new authServices();
