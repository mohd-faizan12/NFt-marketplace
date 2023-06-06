const express = require('express');
const route = express.Router();
const Controller = require('../Controller/controller');
const authController= require("../Controller/authControler");
const nftcontroller = require('../Controller/nftcontroller');

const upload = require('../middleware/multermiddleware');
const controller = require('../Controller/controller');





route.post('/userlogin', Controller.userLogin);
route.post('/walletconnect', Controller.walletConnect);
route.post('/uploadprofile', Controller.uploadProfile);
route.post('/createnft', Controller.createNft);
route.post('/createNftCollection', Controller.createNftCollection);
route.post('/uploadvedio',upload.single('nftvedio'), Controller.uploadVedio);
route.post('/qrcodecreate', Controller.qrcodeCreate);


//----------------contractr services-------------------------
route.get('/cgetallnfts', nftcontroller.getallnfts);
route.post('/getmynfts', nftcontroller.createtoken);
//----------------------------
route.post('/userFollow', Controller.userFollow);
route.post('/userUnFollow',Controller.userUnFollow);
route.post('/totaluserFollowers',controller.CountUserFollowers);


module.exports = route;