const nftreadServices = require("../servicesnft/readcontract");
const nftwriteServices = require("../servicesnft/writecontract");
const nftServices = require("../Services/nftservice");
const vedioservices = require("../Services/vedioservice");
const AUTH_HEADER = "Authorization";
const jwts = require("jsonwebtoken");
const Jwtkey = require("../utilities/jwtutilis");

class nftservices {
  async getallnfts(req, res) {
    // const userDetails = req.userDetails;
    const result = await nftreadServices.getallnfts(req, res);
    res.json(result);
    return;
  }

  // async createtoken(req,res) {
  //     // const userDetails = req.userDetails;
  //     const result = await nftreadServices.createtoken(req,res);
  //     res.json(result);
  //     return;
  // }

  async createtoken(req, res) {
    const Credential = req.body;
    // const userDetails = req.userDetails;
    const result = await nftwriteServices.createtoken(Credential);
    res.json(result);
    return;
  }

  async Latest_Drop(req, res) {
    const result = await nftServices.latest_Drops(res);
    res.json(result);
  }
  async userLatest_Drop(req, res) {
    const auth_header = req.header(AUTH_HEADER);
    if (!auth_header || !auth_header.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "Authentication Failed. please send Bearer Token",
      });
    }
    const result = await nftServices.userLatest_Drops(auth_header);
    res.json(result);
  }
  async top_Creaters(req, res) {
    const result = await vedioservices.topCreaters();
    res.json(result);
  }
  async userTop_Creaters(req, res) {
    const auth_header = req.header(AUTH_HEADER);
    if (!auth_header || !auth_header.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "Authentication Failed. please send Bearer Token",
      });
    }
    const result = await vedioservices.usertopCreaters(auth_header);
    res.json(result);
  }
  async top_Collection(req, res) {
    const result = await nftServices.topCollection();
    res.json(result);
  }
  async getAll_Nft(req, res) {
    const result = await nftServices.get_All_Nft();
    res.json(result);
  }
  async usergetAll_Nft(req, res) {
    const auth_header = req.header(AUTH_HEADER);
    if (!auth_header || !auth_header.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "Authentication Failed. please send Bearer Token",
      });
    }
    const token = auth_header.substr(7);
    // const tcheck = jwts.verify(token, Jwtkey.Jwt_Key);
    // if (!tcheck) {
    //   return res.status(400).json({
    //     status: 400,
    //     message: "Invalid or malformed jwt token",
    //   });
    // }
    const result = await nftServices.userGet_All_Nft(token);
    res.json(result);
  }
  async delete_Nft(req, res) {
    const data = req.query;
    const itemName = data.itemname;
    const result = await nftServices.deleteNft(itemName);
    res.json(result);
  }

  async list_Nft(req, res) {
    const data = req.body;
    const result = await nftServices.ListNft(data);
    res.json(result);
  }

  async Collection_list(req, res) {
    const result = await nftServices.collectionList();
    res.json(result);
  }
  async getMyCollection(req, res) {
    const data = req.query;
    const walledAddr = data.walletId;
    const result = await nftServices.my_collection(walledAddr);
    res.json(result);
  }
  async collectionPreview(req, res) {
    const data = req.query;
    const collecName = data.collectionName;
    const result = await nftServices.collection_Preview(collecName);
    res.json(result);
  }
  async nftDetails(req, res) {
    const data = req.query;
    const item_Name = data.itemname;
    const result = await nftServices.nft_Details(item_Name);
    res.json(result);
  }
}
module.exports = new nftservices();
