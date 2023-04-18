
// const fs = require("fs");
const nftservices = require("../Services/nftservice")
const userServices = require("../Services/userservices")
const vedioServices = require("../Services/vedioservice")
const response = require("../Exception-handeling/response");
const axios = require('axios');




class Controller {
async usersignupdetails(req, res) {
    const Credential = req.body;
    const result = await userservices.usersignupdetails(Credential);
    res.status(200).json({
        result: result
    });
    console.log("user registration Successfully")
 }

 

 async walletConnect(req,res){
     const Credential = req.body;
     const result = await userServices.walletConnect(Credential);
     res.status(200).json({
        result: result
     });
     console.log("walletconnected")
 }

 async uploadProfile(req,res){
    const Credential = req.body;
    const result = await userServices.uploadProfile(Credential);
    res.status(200).json({
       result: result
    });
    console.log("data added")
}

async createNft(req,res){
    const Credential = req.body;
    const result = await nftservices.createNft(Credential);
    res.status(200).json({
       result: result
    });
    console.log("data added")
}

async createNftCollection(req,res){
    const Credential = req.body;
    const result = await nftservices.createNftCollection(Credential);
    res.status(200).json({
       result: result
    });
    console.log("data added")
}

async uploadVedio(req,res){
    const Credential = req.body;
    const result = await vedioServices.uploadVedio(Credential);
    res.status(200).json({
       result: result
    });
    console.log("data added")
}

}
module.exports = new Controller;