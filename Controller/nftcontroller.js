const nftreadServices = require("../servicesnft/readcontract");
const nftwriteServices = require("../servicesnft/writecontract");
const nftServices = require("../Services/nftservice");
const vedioservices = require("../Services/vedioservice");

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
  async top_Creaters(req, res) {
    const result = await vedioservices.topCreaters();
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
}
module.exports = new nftservices();
