
const bcrypt = require("bcrypt");
const authUser = require("../db/authUsermodel");
const response = require("../Exception-handeling/Exceptionhandeling");
const { createModulerLogger } = require("../LoggerServices/loggerservices");
const logger = createModulerLogger("authUser")
class authServices {

    async userloginServices(payload) {
        try {
            if (!payload.wallet || !payload.password) {
                return response.error_Bad_request("Please don't leave any field empty");
            }
            payload.password = bcrypt.hashSync(payload.password, bcrypt.genSaltSync());
            const savedb = await authUser.create(payload);
            logger.info("user is successfuly created");
            return response.Success("user is successfuly created");
        } catch (error) {

            logger.error("user is not create something went to wrong ");
            return response.error_Bad_request("user is not create something went to wrong ");
        }

    }






}
module.exports = new authServices();
