const jsonwebtoken = require("jsonwebtoken");
const response = require("../Exception-handeling/Exceptionhandeling");

const Jwtkey = require("../utilities/jwtutilis");

class authMiddleware {
    async userAuthanticationMiddleware(req, res, next) {
        try {
            const authHeader = req.header("Authorization");
            if (!authHeader) {
                return res.status(401).json({
                    message: "Authentication Failed. please give Token",
                });
            } else if (!authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    message: "Authentication Failed. please send Bearer Token",
                });
            }
            const gettoken = authHeader.substr(7);

            console.log("gettoken", gettoken);
            const verifytoken = jsonwebtoken.verify(gettoken, Jwtkey.Jwt_Key);



            if (!verifytoken) {
                return response.Unauthorized_response("Authentication Failed. Token Expired or Malformed Token")
            }
            next();
            res.json(response.Success("You are authenticated successfully"));

        } catch (error) {
         
            res.json(response.error_Bad_request("Authantication is failed"))
        }


    }



}
module.exports = new authMiddleware()