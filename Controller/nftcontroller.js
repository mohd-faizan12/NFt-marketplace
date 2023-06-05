
const nftreadServices=require("../servicesnft/readcontract");
const nftwriteServices=require("../servicesnft/writecontract");
class nftservices {


async getallnfts(req,res) {
    // const userDetails = req.userDetails;
    const result = await nftreadServices.getallnfts(req,res);
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
}
module.exports = new nftservices();