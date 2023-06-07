
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
        res.json({result})

    }

    async uploadProfile(req, res) {
        const Credential = req.body;
        const authHeader = req.headers['authorization'];
        const result = await userServices.uploadProfile(Credential,authHeader);
        res.json({result})

    }

    async userLogin(req, res) {
        const Credential = req.body;
        const result = await userServices.userLogin(Credential);
      
        res.json({result})

    }

    async createNft(req, res) {
        const Credential = req.body;
        const result = await nftservices.createNft(Credential);
        res.status(result.status).json({ result });

    }

    async createNftCollection(req, res) {
        const Credential = req.body;
        const result = await nftservices.createNftCollection(Credential);
        res.json({result})
    }

    async uploadVedio(req, res) {
        const Credential = req.body;
        Credential.video = req.file;

        const result = await vedioServices.UploadVedio(Credential);
        res.json({result})
    }


    async qrcodeCreate(req, res) {
        const Credential = req.body;
        const result = await vedioServices.qrcodeCreate(Credential);
     
        // res.status(result.status).json({result});
        res.send(result.data);

    }
    async userFollow(req, res) {
        const objId = req.query.userid;
        // const querypayload =ObjectId(objId)
        const { targetUserId } = req.body;
        // The user performing the follow action


        const result = await userServices.userFollow(objId, targetUserId)
        res.json(result);
    }
    async userUnFollow(req, res) {
        const objId = req.query.userid;

        const { targetUserId } = req.body;



        const result = await userServices.userUnFollow(objId, targetUserId)
        res.json({result});
    }
    async CountUserFollowers(req, res) {
        const userId = req.query.userid;


        const result = await userServices.countuserfollower(userId)
        res.json({result});
    }
    async getprofileDetails(req,res){
        const pageNumber = parseInt(req.query.pageNumber) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const result= await userServices.GetprofileDetails(pageNumber,limit);
  
        res.json({result})
    }
  










}
module.exports = new Controller;