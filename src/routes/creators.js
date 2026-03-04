const express = require('express');
const router = express.Router();
const creatorCtrl = require('../controllers/creatorController');
const nftCtrl = require('../controllers/nftController');
const marketCtrl = require('../controllers/marketplaceController');
const imageCtrl = require('../controllers/imageController');
const { profileUpload, coverUpload, formData } = require('../middleware/upload');

// ──────────────────── Session & Auth ────────────────────
router.get('/checkSession', creatorCtrl.checkSession);
router.post('/login', formData.none(), creatorCtrl.userLogin);
router.post('/signUp/:walletAddress', creatorCtrl.signUp);

// ──────────────────── Validation ────────────────────
router.get('/checkEmail/:email', creatorCtrl.checkEmail);
router.get('/checkWallet/:wallet', creatorCtrl.checkWallet);
router.get('/checkUsername/:username', creatorCtrl.checkUserName);

// ──────────────────── Categories ────────────────────
router.get('/getCategories', nftCtrl.getAllCategories);
router.get('/getCategoryArts/:id', nftCtrl.fetchAllNftsWithCatId);

// ──────────────────── NFTs ────────────────────
router.get('/singleArt', nftCtrl.getSingleArt);
router.get('/getArts', nftCtrl.fetchAllNfts);
router.get('/getNfts', nftCtrl.getAllNftsData);
router.get('/getFeeds/:wallet', nftCtrl.getFeeds);

// ──────────────────── Creators ────────────────────
router.get('/allCreators', creatorCtrl.allCreators);
router.get('/singleCreator/:walletAddress', creatorCtrl.singleCreator);
router.get('/inWallet/:walletAddress', nftCtrl.inWalletArts);
router.post('/updateInfo', formData.none(), creatorCtrl.updateCreatorInfo);
router.post('/editPrice', formData.none(), creatorCtrl.editPrice);
router.post('/uploadProfilePicture', profileUpload, creatorCtrl.updateProfilePic);
router.post('/uploadCoverPicture', coverUpload, creatorCtrl.updateCoverPic);
router.post('/subscribe', formData.none(), creatorCtrl.subscribe);

// ──────────────────── Minting ────────────────────
router.post('/mintArt', nftCtrl.mintArt);

// ──────────────────── Fixed Price ────────────────────
router.post('/putOnFixedPrice', formData.none(), marketCtrl.putOnFixedSale);
router.post('/updateSalePrice', marketCtrl.updateSalePrice);
router.post('/cancelFixedSale', marketCtrl.cancelFixedPriceSale);
router.post('/directTransfer', marketCtrl.directTransfer);

// ──────────────────── Auction ────────────────────
router.post('/listOnAuction', formData.none(), marketCtrl.listOnAuction);
router.post('/addBidding', marketCtrl.addBidding);
router.post('/auctionTransfer', marketCtrl.auctionTransfer);

// ──────────────────── Offers ────────────────────
router.post('/makeOffer', marketCtrl.makeOffer);
router.get('/offersMadeByUser/:walletAddress', marketCtrl.offersMadeByUser);
router.get('/offersReceivedByUser/:walletAddress', marketCtrl.offersReceivedByUser);

// ──────────────────── Image Generation ────────────────────
router.post('/generateImage', formData.none(), imageCtrl.generateImage);

module.exports = router;
