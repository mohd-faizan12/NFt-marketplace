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
route.post('/createnft', authMiddleware.userAuthanticationMiddleware, Controller.createNft);
route.post('/createNftCollection', Controller.createNftCollection);
route.post('/uploadvedio', uploadFile, Controller.uploadVedio);
route.post('/qrcodecreate', authMiddleware.userAuthanticationMiddleware, Controller.qrcodeCreate);


//----------------contract services-------------------------
route.get('/cgetallnfts', authMiddleware.userAuthanticationMiddleware, nftcontroller.getallnfts);
route.post('/getmynfts', authMiddleware.userAuthanticationMiddleware, nftcontroller.createtoken);
//----------------------------
route.post('/userUnFollow', authMiddleware.userAuthanticationMiddleware, Controller.userUnFollow);
route.post('/totaluserFollowers', authMiddleware.userAuthanticationMiddleware, controller.CountUserFollowers);
route.get('/getprofileDetails', authMiddleware.userAuthanticationMiddleware, Controller.getprofileDetails)
route.post('/directSale',  Controller.directSale);
route.get('/getNFTpreview',Controller.getNFTpreview);

route.get('/latest-drops',nftcontroller.Latest_Drop);
route.get('/top-creaters',nftcontroller.top_Creaters); 
route.get('/top-collection',nftcontroller.top_Collection);
route.get('/getall-nft',nftcontroller.getAll_Nft); 

// ---------------------------Token Based------------------------------

route.get('/user-latest-drops',authMiddleware.middleware_Auth,nftcontroller.userLatest_Drop);  //done
route.get('/user-top-creaters',authMiddleware.middleware_Auth,nftcontroller.userTop_Creaters);  //done
route.get('/user-getall-nft',authMiddleware.middleware_Auth,nftcontroller.usergetAll_Nft); 

//------------------------------------------------------------------

route.delete('/delete-nft',nftcontroller.delete_Nft);
route.post('/list-nft',nftcontroller.list_Nft);
route.get('/collection-list',nftcontroller.Collection_list);
route.get('/my-collection',nftcontroller.getMyCollection);
route.get('/collection-preview',nftcontroller.collectionPreview);
route.get('/get-nft',nftcontroller.nftDetails);
route.post('/makeoffer',authMiddleware.middleware_Auth,nftcontroller.makeAnOffer);
route.get('/profile-details',authMiddleware.middleware_Auth,nftcontroller.profileDetails); //user self
route.get('/user-nfts',authMiddleware.middleware_Auth,nftcontroller.userNFTs);
route.get('/get-alloffers',nftcontroller.nftsOffer);
// route.post('/follow',authMiddleware.middleware_Auth,nftcontroller.user_Follow);
route.post('/userFollow', authMiddleware.middleware_Auth, Controller.userFollow);
 
route.get('/user-profileDetails',authMiddleware.middleware_Auth,nftcontroller.userProfileDetails);
route.post('/uploadprofile', authMiddleware.userAuthanticationMiddleware, Controller.uploadProfile);



module.exports = route;