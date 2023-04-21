
const authServices = require("../Services/authServices")

class AuthController {


    async userloginController(req, res) {
        const payload = req.body;
        const ServiceResult = await authServices.userloginServices(payload);
        res.status(ServiceResult.status).json({ ServiceResult });
    }






}
module.exports = new AuthController