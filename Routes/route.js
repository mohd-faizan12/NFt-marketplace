const express = require('express');
const route = express.Router();
const Controller = require('../Controller/controller');
const authController = require("../Controller/authControler");
const nftcontroller = require('../Controller/nftcontroller');

const upload = require('../middleware/multermiddleware');
const controller = require('../Controller/controller');
const authMiddleware = require("../middleware/userMiddleware")



const uploadFile = upload.fields([{
    name: "video", maxCount: 1
},
{
    name: "thumbnail", maxCount: 1

}])
route.post('/user_registration', Controller.user_registration);
route.post('/otp_verification', Controller.otp_verification);
route.post('/user_login', Controller.userLogin);
route.post('/walletconnect', Controller.walletConnect);
route.post('/forgot_password', Controller.forgot_password);
route.post('/verifyotpPasschange', Controller.verifyotpPasschange);
route.post('/resetpassword', Controller.resetpassword);
route.post('/updatepassword', Controller.updatepassword);







//---------------------------------------------------------------------
route.post('/uploadprofile', authMiddleware.userAuthanticationMiddleware, Controller.uploadProfile);
route.post('/createnft', authMiddleware.userAuthanticationMiddleware, Controller.createNft);
route.post('/createNftCollection', authMiddleware.userAuthanticationMiddleware, Controller.createNftCollection);
route.post('/uploadvedio', uploadFile, Controller.uploadVedio);
route.post('/qrcodecreate', authMiddleware.userAuthanticationMiddleware, Controller.qrcodeCreate);


//----------------contractr services-------------------------
route.get('/cgetallnfts', authMiddleware.userAuthanticationMiddleware, nftcontroller.getallnfts);
route.post('/getmynfts', authMiddleware.userAuthanticationMiddleware, nftcontroller.createtoken);
//----------------------------
route.post('/userFollow', authMiddleware.userAuthanticationMiddleware, Controller.userFollow);
route.post('/userUnFollow', authMiddleware.userAuthanticationMiddleware, Controller.userUnFollow);
route.post('/totaluserFollowers', authMiddleware.userAuthanticationMiddleware, controller.CountUserFollowers);
route.get('/getprofileDetails', authMiddleware.userAuthanticationMiddleware, Controller.getprofileDetails)
route.post('/directSale',  Controller.directSale);
route.get('/getNFTpreview',Controller.getNFTpreview)







module.exports = route;





//# domain https://nftbackend.uniblok.io