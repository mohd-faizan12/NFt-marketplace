
// const fs = require("fs");
const nftservices = require("../Services/nftservice")
const userServices = require("../Services/userservices")
const vedioServices = require("../Services/vedioservice")
// const createModulerLogger = require("../LoggerServices/loggerservices");
// const logger = createModulerLogger("Controller")




class Controller {
    // async usersignupdetails(req, res) {
    //     const Credential = req.body;
    //     const result = await userservices.usersignupdetails(Credential);
    //     res.status(result.status).json({ result });
    // }



    async walletConnect(req, res) {
        const Credential = req.body;
        const result = await userServices.walletConnect(Credential);
        res.status(result.status).json({ result });

    }

    async uploadProfile(req, res) {
        const Credential = req.body;
        const result = await userServices.uploadProfile(Credential);
        res.status(result.status).json({ result });

    }

    async createNft(req, res) {
        const Credential = req.body;
        const result = await nftservices.createNft(Credential);
        res.status(result.status).json({result});
      
    }

    async createNftCollection(req, res) {
        const Credential = req.body;
        const result = await nftservices.createNftCollection(Credential);
        res.status(result.status).json({result});
    }

    async uploadVedio(req, res) {
        const Credential = req.body;
        const result = await vedioServices.UploadVedio(Credential);
        res.status(result.status).json({result});
    }
}
module.exports = new Controller;