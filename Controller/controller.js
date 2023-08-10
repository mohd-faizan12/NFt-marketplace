// const fs = require("fs");
const nftservices = require("../Services/nftservice");
const userServices = require("../Services/userservices");
const vedioServices = require("../Services/vedioservice");
// const createModulerLogger = require("../LoggerServices/loggerservices");
// const logger = createModulerLogger("Controller")

class Controller {
  async userLogin(req, res) {
    const Credential = req.body;
    const result = await userServices.userLogin(Credential);

    res.json({ result });
  }
  async forgot_password(req, res) {
    const Credential = req.body;
    const result = await userServices.forgot_password(Credential);
    res.json({ result });
  }
  async verifyotpPasschange(req, res) {
    const Credential = req.body;
    const result = await userServices.verifyotpPasschange(Credential);
    res.json({ result });
  }
  async resetpassword(req, res) {
    const Credential = req.body;
    const result = await userServices.resetpassword(Credential);
    res.json({ result });
  }
  async user_registration(req, res) {
    const Credential = req.body;
    const result = await userServices.user_registration(Credential);
    res.json({ result });
  }
  async otp_verification(req, res) {
    const Credential = req.body;
    const result = await userServices.otp_verification(Credential);
    res.json({ result });
  }

  async walletConnect(req, res) {
    const Credential = req.body;
    const userDetails = req.userDetails;
    const result = await userServices.walletConnect(Credential, userDetails);
    res.json({ result });
  }

  async uploadProfile(req, res) {
    const Credential = req.body;
    const userData = req.userDetails; 

    const result = await userServices.uploadProfile(Credential, userData);
    res.json({ result });
  }

  async updatepassword(req, res) {
    const Credential = req.body;
    const result = await userServices.update_password(Credential);
    res.json({ result });
  }

  async createNft(req, res) {
    const Credential = req.body;
    const result = await nftservices.createNft(Credential);
    res.status(result.status).json({ result });
  }

  async createNftCollection(req, res) {
    const Credential = req.body;
    const userData = req.userDetails;

    const result = await nftservices.createNftCollection(userData, Credential);
    res.json({ result });
  }

  async uploadVedio(req, res) {
    const Credential = req.body;
    // Credential.video = req.files.video;
    // Credential.thumbnail = req.files.thumbnail;

    const result = await vedioServices.UploadVedio(req, Credential);
    res.status(result.status).json({ result });
  }

  async qrcodeCreate(req, res) {
    const Credential = req.body;
    const result = await vedioServices.qrcodeCreate(Credential);

    // res.status(result.status).json({result});
    res.send(result.data);
  }
  async userFollow(req, res) {
    const { _id } = req.userDetails;
    const { userId } = req.body;

    const result = await userServices.userFollow(_id, userId);
    res.json(result);
  }
  async userUnFollow(req, res) {
    const objId = req.query.userid;

    const { targetUserId } = req.body;

    const result = await userServices.userUnFollow(objId, targetUserId);
    res.json({ result });
  }
  async CountUserFollowers(req, res) {
    const userId = req.query.userid;

    const result = await userServices.countuserfollower(userId);
    res.json({ result });
  }
  async getprofileDetails(req, res) {
    const authHeader = req.headers["authorization"];
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const result = await userServices.GetprofileDetails(
      pageNumber,
      limit,
      authHeader
    );

    res.json({ result });
  }

  async directSale(req, res) {
    const Credential = req.body;
    const result = await nftservices.directSale(Credential);
    res.json({ result });
  }

  async getNFTpreview(req, res) {
    const Credential = req.query;
    const result = await nftservices.getNFTpreview(Credential);
    res.json({ result });
  }
}
module.exports = new Controller();
