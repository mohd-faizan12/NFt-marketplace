const express = require('express');
const route = express.Router();
const Controller = require('../Controller/controller');
const authController= require("../Controller/authControler")




route.post('/userlogin', authController.userloginController);
route.post('/walletconnect', Controller.walletConnect);
route.post('/uploadprofile', Controller.uploadProfile);
route.post('/createnft', Controller.createNft);
route.post('/createNftCollection', Controller.createNftCollection);
route.post('/uploadvedio', Controller.uploadVedio);




module.exports = route;