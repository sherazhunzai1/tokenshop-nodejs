const express = require("express");
const creatorController = require("../controller/creators");
const profileUpload = require("../config/profileUpload");
const coverUpload = require("../config/coverUpload");
const formdata = require("./../config/acceptFormData");
const upload=require("./../config/fileUpload");
const router = express.Router();

router.get("/checkSession", creatorController.checkSession);

router.get("/checkEmail/:email", creatorController.checkEmail);
router.get("/checkWallet/:wallet", creatorController.checkWallet);
router.get("/checkUsername/:username", creatorController.checkUserName);
router.post("/signUp/:walletAddress", creatorController.signUp);

// category routes
router.get("/getCategories", creatorController.getAllCategories);
router.get("/getCategoryArts/:id", creatorController.fetchAllNftsWithCatId);

// art routes
router.get("/singleArt/:tokenId", creatorController.getSingleArt);
router.get("/getArts", creatorController.fetchAllNfts);
router.get("/getNfts", creatorController.getAllNftsData);

//creator routes

router.post(
  "/uploadProfilePicture",
  profileUpload,
  creatorController.updateProfilePic
);
router.post(
  "/uploadCoverPicture",
  coverUpload,
  creatorController.updateCoverPic
);

router.post("/login", formdata.none(), creatorController.userLogin);

router.get("/allCreators", creatorController.allCreators);
router.get("/singleCreator/:walletAddress", creatorController.singleCreator);
router.get("/inWallet/:walletAddress", creatorController.inWalletArts);
router.post("/updateInfo", creatorController.updateCreatorInfo);

//mint route
router.post("/mintArt",upload, creatorController.mintArt);

//list routes
//list on Fiexed price

router.post("/putOnFixedPrice",formdata.none(), creatorController.putOnFixedSale);
router.post("/updateSalePrice", creatorController.updateSalePrice);
router.post("/cancelFixedSale", creatorController.cancelFixedPriceSale);
router.post("/directTransfer", creatorController.directTransfer);

//listed on Auction
router.post("/listOnAuction",formdata.none(), creatorController.listOnAuction);
router.post("/addBidding", creatorController.addBidding);
router.post("/auctionTransfer", creatorController.auctionTransfer);

// offer Routes
router.post("/makeOffer", creatorController.makeOffer);
router.get(
  "/offersMadeByUser/:walletAddress",
  creatorController.offersMadeByUser
);
router.get(
  "/offersReceivedByUser/:walletAddress",
  creatorController.offersReceivedByUser
);
router.post("/generateImage", formdata.none(), creatorController.generateImage);

// router.post("/passwordGenrator", async (req, res, next) => {
//   let password = req.body.password;
//   const salt = await bcrypt.genSalt(10);

//   password = await bcrypt.hash(password, salt);
//   return res.status(201).json(password);
// });

module.exports = router;
