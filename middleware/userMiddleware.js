const jsonwebtoken = require("jsonwebtoken");
const response = require("../Exception-handeling/Exceptionhandeling");

const Jwtkey = require("../utilities/jwtutilis");
const userSchema = require("../db/user");
const user = require("../db/user");

class authMiddleware {
  async userAuthanticationMiddleware(req, res, next) {
    try {
      const authHeader = req.header("Authorization");
      if (!authHeader) {
        res.status(401).json({
          message: "Authentication Failed. please give Token",
        });
      } else if (!authHeader.startsWith("Bearer ")) {
        res.status(401).json({
          message: "Authentication Failed. please send Bearer Token",
        });
      }
      const gettoken = authHeader.substr(7);

      const verifytoken = jsonwebtoken.verify(gettoken, Jwtkey.Jwt_Key);

      if (!verifytoken) {
        res.json(
          response.Unauthorized_response(
            "Authentication Failed. Token Expired or Malformed Token"
          )
        );
      }
      req.jwtToken = gettoken;
      next();
    } catch (error) {
      res.json(response.error_Bad_request("Authantication is failed"));
    }
  }

  async middleware_Auth(req, res, next) {
    try {
      const authHeader = req.header("Authorization");
      if (!authHeader) {
        res.status(401).json({
          message: "Authentication Failed. please give Token",
        });
      } else if (!authHeader.startsWith("Bearer ")) {
        res.status(401).json({
          message: "Authentication Failed. please send Bearer Token",
        });
      }
      const token = authHeader.substr(7);

      const verifytoken = jsonwebtoken.verify(token, Jwtkey.Jwt_Key);

      if (verifytoken) {
        let user = await userSchema.findOne({ jwttoken: token });
        if (user) {
          req.userDetails = user;
          next();
        } else {
          res.json(
            response.Unauthorized_response(
              "Authentication Failed. Token Expired or Malformed Token"
            )
          );
        }
      } else {
        res.json(
          response.Unauthorized_response(
            "Authentication Failed. Token Expired or Malformed Token"
          )
        );
      }
    } catch (error) {
      return res.status(404).json({
        message: "Authentication failed" + error,
      });
    }
  }
}
module.exports = new authMiddleware();
