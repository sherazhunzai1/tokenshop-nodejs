require("dotenv").config();
const jwt = require("jsonwebtoken");
const Creators = require("../model/creators");
const Nfts = require("../model/nfts");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Joi = require("joi");
let creators = new Creators();
let nfts = new Nfts();
const nodeHtmlToImage = require("node-html-to-image");
const fs = require("fs");
const offersReceivedByUser = async (req, res, next) => {
  let walletAddress = req.params.walletAddress;
  try {
    const offersReceived = [];
    const [result] = await nfts.offersReceivedByUser(walletAddress);
    if (result.length > 0) {
      result.forEach((rowsData) => {
        let data = {
          tokenId: rowsData.tokenId,
          title: rowsData.title,
          artImg: rowsData.image,
          offerPrice: rowsData.offer_price,
          ownerName: rowsData.username,
          ownerWallet: rowsData.walletAddress,
          ownerImg: rowsData.img,
          offerMadeByName: rowsData.offerMadeByName,
          offerMadeByWalletAddress: rowsData.offerMadeByWalletAddress,
          offerMadeByImage: rowsData.offerMadeByImage,
          status: rowsData.status,
          createdAt: rowsData.created_at,
        };
        offersReceived.push(data);
      });

      return res.status(201).json({
        offersReceived: offersReceived,
      });
    } else {
      return next({ code: 404, message: "no data found" });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};

const offersMadeByUser = async (req, res, next) => {
  let walletAddress = req.params.walletAddress;
  try {
    const offersMade = [];
    const [result] = await nfts.offersMadeByUser(walletAddress);
    if (result.length > 0) {
      result.forEach((rowsData) => {
        let data = {
          tokenId: rowsData.tokenId,
          title: rowsData.title,
          artImg: rowsData.image,
          offerPrice: rowsData.offer_price,
          ownerName: rowsData.ownerName,
          ownerWallet: rowsData.ownerWallet,
          ownerImg: rowsData.ownerImg,
          creatorName: rowsData.username,
          creatorWallet: rowsData.walletAddress,
          creatorImg: rowsData.img,
          status: rowsData.status,
          createdAt: rowsData.created_at,
        };
        offersMade.push(data);
      });

      return res.status(201).json({
        offersMade: offersMade,
      });
    } else {
      return next({ code: 404, message: "no data found" });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};

const makeOffer = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
    
  
 
   * - offerId,
   * - tokenId,
   * - senderAddress,
   * - receiverAddress,
   * - offerPrice,
  

   
 
     */
  let payload = req.body;
  let type = "offerReceived";
  if (payload) {
    try {
      const result = await nfts.makeOffer(payload);
      const createNotification = await nfts.offerReceivedNotification(
        payload.receiverAddress,
        payload.tokenId,
        payload.offerId,
        type
      );

      if (result && createNotification) {
        return res.status(201).json({
          message: "Offer Made successfully",
          tokenId: payload.tokenId,
          offerId: payload.offerId,
        });
      } else {
        return next({ code: 404, message: "no request found" });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};
const auctionTransfer = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
    
    
  
 
   * -  transferFrom,
   * - transferTo,
   * - amount,
   * - tokenId,
   * - auctionId,
   * - transferHash,

   
 
     */
  let payload = req.body;

  if (payload) {
    try {
      const result = await nfts.auctionTransfer(payload);
      const resetListings = await nfts.resetNFTStatus(payload.tokenId);
      const updateFixedTable = await nfts.resetAuctionTable(
        payload.tokenId,
        payload.auctionId
      );
      const createNotification = await nfts.createNotificationAuctionTransfer(
        payload.transferTo,
        payload.tokenId
      );
      const updateOwner = await nfts.updateOwnerAfterDirectTransfer(
        payload.tokenId,
        payload.transferTo
      );

      if (
        result &&
        resetListings &&
        updateFixedTable &&
        createNotification &&
        updateOwner
      ) {
        return res.status(201).json({
          message: "NFT Transferred successfully",
          tokenId: payload.tokenId,
        });
      } else {
        return next({ code: 404, message: "no request found" });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};

const addBidding = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
    
    
  
  * - tokenId,
  * - auctionId,
  * - highestBid,
   * - endTimeInSeconds,
    * - highestBidder,
    * - txHash,
     */
  let payload = req.body;

  if (payload) {
    try {
      const updateAuctionTable = await nfts.updateBiddingOnAuction(
        payload.tokenId,
        payload.auctionId,
        payload.highestBid,
        payload.endTimeInSeconds,
        payload.highestBidder
      );
      const result = await nfts.addBidding(
        payload.auctionId,
        payload.highestBidder,
        payload.txHash,
        payload.highestBid
      );

      if (result && updateAuctionTable) {
        return res.status(201).json({
          message: "Bidded Successfylly",
          tokenId: payload.tokenId,
        });
      } else {
        return next({ code: 404, message: "no request found" });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};

const listOnAuction = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
    
    
  
 * - auctionId,
  * - tokenId,
   * - transactionHash,
    * - ownerWallet,
     * - reservePrice 
  


    , 
 
     */
  let payload = req.body;

  if (payload) {
    try {
      const result = await nfts.listOnAuction(payload);
      const updateStatusOfNFTs = await nfts.updateStatusOfNFTtoAuction(
        payload.tokenId
      );
      if (result && updateStatusOfNFTs) {
        return res.status(201).json({
          message: "Listed On Auction Successfylly",
          tokenId: payload.tokenId,
        });
      } else {
        return next({ code: 404, message: "no request found" });
      }
    } catch (error) {
      return next({ code: 401, message: error.message });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};
const directTransfer = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
    
    
  
 
   * -  transferFrom,
   * - transferTo,
   * - amount,
   * - tokenId,
   * - orderId,
   * - transferHash,

   
 
     */
  let payload = req.body;

  if (payload) {
    try {
      const result = await nfts.directTransfer(payload);
      const resetListings = await nfts.resetNFTStatus(payload.tokenId);
      const updateFixedTable = await nfts.updateFixedTable(
        payload.tokenId,
        payload.orderId
      );
      // const createNotification = await nfts.createNotificationDirectTransfer(
      //   payload.transferTo,
      //   payload.tokenId
      // );
      const updateOwner = await nfts.updateOwnerAfterDirectTransfer(
        payload.tokenId,
        payload.transferTo
      );

      if (
        result &&
        resetListings &&
        updateFixedTable &&
        // createNotification &&
        updateOwner
      ) {
        return res.status(201).json({
          message: "NFT Transferred successfully",
          tokenId: payload.tokenId,
        });
      } else {
        return next({ code: 404, message: "no request found" });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};
const cancelFixedPriceSale = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
    
    
  
 * - orderId,
  * - tokenId,

   
 
     */
  let payload = req.body;

  if (payload) {
    try {
      const result = await nfts.cancelFixedPriceSale(payload);
      const resetListings = await nfts.resetNFTStatus(payload.tokenId);
      if (result && resetListings) {
        return res.status(201).json({
          message: "Successfully Cancelled Fixed Price Sale",
          tokenId: payload.tokenId,
          price: payload.price,
        });
      } else {
        return next({ code: 404, message: "no request found" });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};
const updateSalePrice = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
    
    
  
 * - orderId,
  * - tokenId,
     * - price 
   
 
     */
  let payload = req.body;

  if (payload) {
    try {
      const result = await nfts.updateSalePrice(payload);
      if (result) {
        return res.status(201).json({
          message: "Sale Price Updated",
          tokenId: payload.tokenId,
          price: payload.price,
        });
      } else {
        return next({ code: 404, message: "no request found" });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};
const putOnFixedSale = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
    
    
  
 * - orderId,
  * - tokenId,
   * - transactionHash,
    * - ownerWallet,
     * - price 
   
 
     */
  let payload = req.body;

  if (payload) {
    try {
      const result = await nfts.putOnFixedSale(payload);
      const updateStatusOfNFTs = await nfts.updateStatusOfNFT(payload.tokenId);
      if (result && updateStatusOfNFTs) {
        return res
          .status(201)
          .json({ message: "Success", tokenId: payload.tokenId });
      } else {
        return next({ code: 404, message: "no request found" });
      }
    } catch (error) {
      return next({ code: 401, message: error.message });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};

const mintArt = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
    
    
     * - video,
     * - image,
     * - name,
     * - categoryId,
     * - description,
     * - facebook,
     *  -instagram,
     * - twitter,
     * - price ,
     * - creatorWallet,
     * - public,
     * - listingType: { fixed: false, auction: false },
      
     
 
     */
  let payload = req.body;

  if (payload) {
    try {
      const result = await nfts.mintArt(payload);
      if (result) {
        return res
          .status(201)
          .json({ message: " Minted Successfully", tokenId: payload.tokenId });

        return next({ code: 404, message: "no request found" });
      }
    } catch (error) {
      return next({ code: 401, message: error.message });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};

const updateCoverPic = async (req, res, next) => {
  try {
    if (req.file == undefined) {
      return next({ code: 400, message: "Please upload a file!" });
    }
    let walletAddress = req.body.walletAddress;

    let image = req.file.filename;

    if (walletAddress && image) {
      try {
        const result = await creators.uploadCoverPic(image, walletAddress);
        if (result) {
          return res.status(201).json({ message: "Cover Picture Updated" });
        } else {
          return next({ code: 404, message: "no data found" });
        }
      } catch (error) {
        return next({ code: 401, message: error });
      }
    } else {
      return next({ code: 400, message: "No Request Found" });
    }
  } catch (err) {
    return res.status(500).json({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};
const updateProfilePic = async (req, res, next) => {
  try {
    let walletAddress = req.body.walletAddress;

    let image = req.image;

    if (walletAddress && image) {
      const [result] = await creators.uploadProfilePic(image, walletAddress);

      return res.status(201).json({ message: "Profile Picture Updated" });
    } else {
      return next({ code: 400, message: "No Request Found" });
    }
  } catch (error) {
    return next({ code: error.status, message: error.message });
  }
};

const inWalletArts = async (req, res, next) => {
  let isSubscribed = false;
  let { walletAddress } = req.params;
  let { user } = req.query;

  if (!walletAddress) {
    return next({ code: 400, message: "No Wallet Address" });
  }
  try {
    const createdArts = [];
    const collectedArts = [];
    if (user) {
      const [subscribe] = await nfts.checkSubscription(walletAddress, user);
      console.log(subscribe, "subscribe");
      if (subscribe.length > 0) {
        isSubscribed = true;
      }
    }
    const [result] = await nfts.createdArts(walletAddress);
    result.forEach((rowsData) => {
      var video = false;
      if (user == rowsData.ownerWallet) {
        isSubscribed = true;
      }
      if (rowsData.nftType === 1 || isSubscribed) {
        video = rowsData.video;
      }
      let data = {
        video: video,
        id: rowsData.nft_id,
        tokenId: rowsData.tokenId,
        title: rowsData.title,
        description: rowsData.description,
        image: rowsData.image,
        sale: rowsData.sale,
        auction: rowsData.auction,
        fixedprice: rowsData.fixedprice,
        explicityContent: rowsData.nftType,
        categoryId: rowsData.cat_id,
        categoryName: rowsData.cat_name,
        categoryDescription: rowsData.cat_description,
        categoryImage: rowsData.cat_img,
        creatorId: rowsData.creatorID,
        creatorName: rowsData.username,
        creatorWallet: rowsData.walletAddress,
        creatorImg: rowsData.img,
        ownerId: rowsData.ownerId,
        ownerName: rowsData.ownerUsername,
        ownerWallet: rowsData.ownerWallet,
        ownerImg: rowsData.ownerImg,
        createdAt: rowsData.created_at,
      };
      createdArts.push(data);
    });
    const [result1] = await nfts.collectedArts(walletAddress);
    result1.forEach((rowsData) => {
      var video = false;
      if (user == rowsData.ownerWallet) {
        isSubscribed = true;
      }
      if (rowsData.nftType === 1 || isSubscribed) {
        video = rowsData.video;
      }
      let data1 = {
        id: rowsData.nft_id,
        tokenId: rowsData.tokenId,
        title: rowsData.title,
        description: rowsData.description,
        image: rowsData.image,
        sale: rowsData.sale,
        auction: rowsData.auction,
        explicityContent: rowsData.nftType,
        video: video,
        fixedprice: rowsData.fixedprice,
        categoryId: rowsData.cat_id,
        categoryName: rowsData.cat_name,
        categoryDescription: rowsData.cat_description,
        categoryImage: rowsData.cat_img,
        creatorId: rowsData.creatorID,
        creatorName: rowsData.username,
        creatorWallet: rowsData.walletAddress,
        creatorImg: rowsData.img,
        ownerId: rowsData.ownerId,
        ownerName: rowsData.ownerUsername,
        ownerWallet: rowsData.ownerWallet,
        ownerImg: rowsData.ownerImg,
        createdAt: rowsData.created_at,
      };
      collectedArts.push(data1);
    });

    return res.status(201).json({
      createdArts: createdArts,
      collectedArts: collectedArts,
    });
  } catch (error) {
    return next({ code: 401, message: error.message });
  }
};

const updateCreatorInfo = async (req, res, next) => {
  /**
   * @dev the payload will contain following properties:
   * - `walletAddress  `,
   * - `firstName`,
   * - `lastName`,
   * - `email`,
   * - `bio`,
   * - `portfolio`,
   * - `twitter`,
   * - `instagram`,

   */
  let payload = req.body;
  const { walletAddress } = payload;

  if (!walletAddress) return next({ code: 400, message: "No Request Found" });

  try {
    const result = await creators.updateInfo(payload);
    if (result) {
      return res.status(201).json({ message: "Info Updated Successfully" });
    } else {
      return next({ code: 404, message: "no data found" });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};

const subscribe = async (req, res, next) => {
  /**
   * @dev the payload will contain following properties:
   * - `walletAddress  `,
   * - `firstName`,
   * - `lastName`,
   * - `email`,
   * - `bio`,
   * - `portfolio`,
   * - `twitter`,
   * - `instagram`,

   */
  let payload = req.body;
  const { subscriber, subscribe_to, price } = req.body;

  if (!subscriber || !subscribe_to || !price)
    return next({ code: 400, message: "BAD Request" });

  try {
    const result = await creators.addSubscription(
      subscriber,
      subscribe_to,
      price
    );
    if (result) {
      return res.status(201).json({ message: "Subscribe Successfully" });
    } else {
      return next({ code: 404, message: "no data found" });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};
const singleCreator = async (req, res, next) => {
  let wallet = req.params.walletAddress;
  const { user } = req.query;
  let isSubscribed = false;
  try {
    if (user) {
      const [subscribe] = await nfts.checkSubscription(wallet, user);

      if (subscribe.length > 0) {
        isSubscribed = true;
      }
    }
    const [result] = await creators.fetchSingle(wallet);
    if (result.length > 0) {
      result[0].isSubscribed = isSubscribed;
      return res.status(201).json(result[0]);
    } else {
      return next({ code: 404, message: "no data found" });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};
const editPrice = async (req, res, next) => {
  const { price, wallet } = req.body;

  if (!price || !wallet) {
    return res.status(400).json("bad request");
  }
  try {
    const [result] = await creators.editPrice(wallet, price);

    return res.status(200).json("price edited successfully");
  } catch (error) {
    return next({ code: 401, message: error });
  }
};
const allCreators = async (req, res, next) => {
  let pageNo = Number(req.query.pageNo);
  let pageCount = 8;
  let start = 0;
  let end = pageCount;
  if (pageNo) {
    if (pageNo === "1") {
      start = 0;
      end = pageCount;
    } else {
      end = pageNo * pageCount;

      start = end - pageCount;
    }
  } else {
    pageNo = 1;
  }

  try {
    const creatorsInfo = [];

    const [creatorsCount] = await creators.fetchAllCount();

    let totalPages = Math.ceil((creatorsCount.length - 1) / pageCount);

    const [result] = await creators.fetchAll(start, pageCount);
    if (result.length > 0) {
      result.forEach((rowsData) => {
        let data = {
          creatorId: rowsData.creatorID,
          username: rowsData.username,
          firstName: rowsData.firstName,
          lastName: rowsData.lastName,
          walletAddress: rowsData.walletAddress,
          image: rowsData.img,
          cover: rowsData.cover,
          bio: rowsData.bio,
          email: rowsData.email,
          portfolio: rowsData.portfolio,
          instagram: rowsData.instagram,
          twitter: rowsData.twitter,
          facebook: rowsData.facebook,
          createdAt: rowsData.createdAt,
        };
        creatorsInfo.push(data);
      });

      return res.status(201).json({
        totalPages: totalPages,
        currentPage: pageNo,
        creatorsInfo: creatorsInfo,
      });
    } else {
      return next({ code: 404, message: "no data found" });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};

const getSingleArt = async (req, res, next) => {
  isSubscribed = false;
  let id = req.params.tokenId;
  const { user } = req.query;
  try {
    const [result] = await nfts.getSingleArt(id);
    if (result.length > 0) {
      result.forEach(async (rowsData) => {
        if (user == rowsData.ownerWallet) {
          isSubscribed = true;
        } else {
          const [checkSubscription] = await nfts.checkSubscription(
            rowsData.ownerWallet,
            user
          );
          if (checkSubscription.length > 0) {
            isSubscribed = true;
          }
        }
        var video = false;
        if (rowsData.nftType === 1 || isSubscribed) {
          video = rowsData.video;
        }
        let data = {
          id: rowsData.nft_id,
          tokenId: rowsData.tokenId,
          title: rowsData.title,
          description: rowsData.description,
          image: rowsData.image,
          socialMediaImage: rowsData.socialMediaImage,
          artistImage: rowsData.artistImage,
          titleImage: rowsData.titleImage,
          video: video,
          sale: rowsData.sale,
          isAuction: rowsData.auction,
          auctionId: rowsData.auctionId,
          reservePrice: rowsData.reservePrice,
          highestBid: rowsData.highestBid,
          bidderAddress: rowsData.bidderAddress,
          bidderUsername: rowsData.bidderUsername,
          bidderImage: rowsData.bidderImage,
          endTimeInSeconds: rowsData.endTimeInSeconds,
          isFixedPrice: rowsData.fixedprice,
          orderId: rowsData.orderId,
          price: rowsData.fixPrice,
          subscrption_price: rowsData.subscrption_price,
          categoryId: rowsData.cat_id,
          categoryName: rowsData.cat_name,
          categoryDescription: rowsData.cat_description,
          categoryImage: rowsData.cat_img,
          creatorId: rowsData.creatorID,
          creatorName: rowsData.username,
          creatorWallet: rowsData.walletAddress,
          creatorImg: rowsData.img,
          ownerId: rowsData.ownerId,
          ownerName: rowsData.ownerUsername,
          ownerWallet: rowsData.ownerWallet,
          ownerImg: rowsData.ownerImg,
          createdAt: rowsData.created_at,
        };
        return res.status(201).json(data);
      });
    } else {
      return next({ code: 404, message: "no data found" });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};

const fetchAllNftsWithCatId = async (req, res, next) => {
  let id = req.params.id;
  let pageNo = Number(req.query.pageNo);
  let pageCount = 8;
  let start = 0;
  let end = pageCount;
  if (pageNo) {
    if (pageNo === "1") {
      start = 0;
      end = pageCount;
    } else {
      end = pageNo * pageCount;

      start = end - pageCount;
    }
  } else {
    pageNo = 1;
  }

  try {
    const nftData = [];

    const [nftsCount] = await nfts.fetchNftsWithCategoryIdCount(id);

    let totalPages = Math.ceil((nftsCount.length - 1) / pageCount);

    const [result] = await nfts.fetchNftsWithCategoryId(id, start, pageCount);
    if (result.length > 0) {
      result.forEach((rowsData) => {
        let data = {
          id: rowsData.nft_id,
          tokenId: rowsData.tokenId,
          title: rowsData.title,
          description: rowsData.description,
          image: rowsData.image,
          sale: rowsData.sale,
          isAuction: rowsData.auction,
          auctionId: rowsData.auctionId,
          reservePrice: rowsData.reservePrice,
          highestBid: rowsData.highestBid,
          bidderAddress: rowsData.bidderAddress,
          bidderUsername: rowsData.bidderUsername,
          bidderImage: rowsData.bidderImage,
          endTimeInSeconds: rowsData.endTimeInSeconds,
          isFixedPrice: rowsData.fixedprice,
          orderId: rowsData.orderId,
          fixedprice: rowsData.fixPrice,
          categoryId: rowsData.cat_id,
          categoryName: rowsData.cat_name,
          categoryDescription: rowsData.cat_description,
          categoryImage: rowsData.cat_img,
          creatorId: rowsData.creatorID,
          creatorName: rowsData.username,
          creatorWallet: rowsData.walletAddress,
          creatorImg: rowsData.img,
          ownerId: rowsData.ownerId,
          ownerName: rowsData.ownerUsername,
          ownerWallet: rowsData.ownerWallet,
          ownerImg: rowsData.ownerImg,
          createdAt: rowsData.created_at,
        };
        nftData.push(data);
      });

      return res.status(201).json({
        totalPages: totalPages,
        currentPage: pageNo,
        nftData: nftData,
      });
    } else {
      return next({ code: 404, message: "no data found" });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = [];
    const [result] = await nfts.fetchCategories();
    if (result.length > 0) {
      result.forEach((rowsData) => {
        let data = {
          categoryId: rowsData.cat_id,
          categoryName: rowsData.cat_name,
          categoryDescription: rowsData.cat_description,
          categoryImage: rowsData.cat_img,
          createdAt: rowsData.createdAt,
        };
        categories.push(data);
      });

      return res.status(201).json({ categoriesData: categories });
    } else {
      return next({ code: 404, message: "no data found" });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};

const fetchAllNfts = async (req, res, next) => {
  let pageNo = Number(req.query.pageNo);
  let pageCount = 8;
  let start = 0;
  let end = pageCount;
  if (pageNo) {
    if (pageNo === "1") {
      start = 0;
      end = pageCount;
    } else {
      end = pageNo * pageCount;

      start = end - pageCount;
    }
  } else {
    pageNo = 1;
  }
  try {
    const nftData = [];
    const [nftsCount] = await nfts.fetchAllNftsCount();

    let totalPages = Math.ceil((nftsCount.length - 1) / pageCount);

    const [result] = await nfts.fetchAllNfts(start, pageCount);
    if (result.length > 0) {
      result.forEach((rowsData) => {
        let data = {
          id: rowsData.nft_id,
          tokenId: rowsData.tokenId,
          title: rowsData.title,
          description: rowsData.description,
          image: rowsData.image,
          sale: rowsData.sale,
          isAuction: rowsData.auction,
          auctionId: rowsData.auctionId,
          reservePrice: rowsData.reservePrice,
          highestBid: rowsData.highestBid,
          bidderAddress: rowsData.bidderAddress,
          bidderUsername: rowsData.bidderUsername,
          bidderImage: rowsData.bidderImage,
          endTimeInSeconds: rowsData.endTimeInSeconds,
          isFixedPrice: rowsData.fixedprice,
          orderId: rowsData.orderId,
          fixedprice: rowsData.fixPrice,
          categoryId: rowsData.cat_id,
          categoryName: rowsData.cat_name,
          categoryDescription: rowsData.cat_description,
          categoryImage: rowsData.cat_img,
          creatorId: rowsData.creatorID,
          creatorName: rowsData.username,
          creatorWallet: rowsData.walletAddress,
          creatorImg: rowsData.img,
          ownerId: rowsData.ownerId,
          ownerName: rowsData.ownerUsername,
          ownerWallet: rowsData.ownerWallet,
          ownerImg: rowsData.ownerImg,
          createdAt: rowsData.created_at,
        };
        nftData.push(data);
      });

      return res.status(201).json({
        totalPages: totalPages,
        currentPage: pageNo,
        nftData: nftData,
      });
    } else {
      return next({ code: 404, message: "no data found" });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};
const getAllNftsData = async (req, res, next) => {
  const { user } = req.query;
  let categoryId = req.query.catId;
  let search = req.query.search;
  let pageNo = Number(req.query.pageNo);
  let pageCount = 8;
  let start = 0;
  let end = pageCount;
  if (pageNo) {
    if (pageNo === "1") {
      start = 0;
      end = pageCount;
    } else {
      end = pageNo * pageCount;

      start = end - pageCount;
    }
  } else {
    pageNo = 1;
  }
  try {
    const nftData = [];
    const [nftsCount] = await nfts.fetchAllDataFilterCount(categoryId, search);

    let totalPages = Math.ceil((nftsCount.length - 1) / pageCount);

    const [result] = await nfts.fetchAllDataFilter(
      start,
      pageCount,
      categoryId,
      search
    );

    if (result.length > 0) {
      await Promise.all(
        result.map(async (rowsData) => {
          var video = false;
          let isSubscribed = false;
          if (user) {
            const [subscribe] = await nfts.checkSubscription(
              rowsData.ownerWallet,
              user
            );

            if (subscribe.length > 0) {
              isSubscribed = true;
            }
          }
          if (rowsData.nftType === 1 || isSubscribed) {
            video = rowsData.video;
          }

          let data = {
            id: rowsData.nft_id,
            tokenId: rowsData.tokenId,
            title: rowsData.title,
            description: rowsData.description,
            image: rowsData.image,
            subscribe: isSubscribed,
            video: video,
            sale: rowsData.sale,
            explicityContent: rowsData.nftType,
            isAuction: rowsData.auction,
            auctionId: rowsData.auctionId,
            reservePrice: rowsData.reservePrice,
            highestBid: rowsData.highestBid,
            bidderAddress: rowsData.bidderAddress,
            bidderUsername: rowsData.bidderUsername,
            bidderImage: rowsData.bidderImage,
            endTimeInSeconds: rowsData.endTimeInSeconds,
            isFixedPrice: rowsData.fixedprice,
            orderId: rowsData.orderId,
            fixedprice: rowsData.fixPrice,
            categoryId: rowsData.cat_id,
            categoryName: rowsData.cat_name,
            categoryDescription: rowsData.cat_description,
            categoryImage: rowsData.cat_img,
            creatorId: rowsData.creatorID,
            creatorName: rowsData.username,
            creatorWallet: rowsData.walletAddress,
            creatorImg: rowsData.img,
            ownerId: rowsData.ownerId,
            ownerName: rowsData.ownerUsername,
            ownerWallet: rowsData.ownerWallet,
            ownerImg: rowsData.ownerImg,
            createdAt: rowsData.created_at,
          };
          nftData.push(data);
        })
      );

      return res.status(201).json({
        totalPages: totalPages,
        currentPage: pageNo,
        nftData: nftData,
      });
    } else {
      return next({ code: 404, message: "no data found" });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};
const getFeeds = async (req, res, next) => {
  const { wallet } = req.params;

  let pageNo = Number(req.query.pageNo);
  let pageCount = 8;
  let start = 0;
  let end = pageCount;
  if (pageNo) {
    if (pageNo === "1") {
      start = 0;
      end = pageCount;
    } else {
      end = pageNo * pageCount;

      start = end - pageCount;
    }
  } else {
    pageNo = 1;
  }
  try {
    const nftData = [];
    // const [nftsCount] = await nfts.fetchAllDataFilterCount(categoryId, search);

    // let totalPages = Math.ceil((nftsCount.length - 1) / pageCount);

    const [subscribers] = await nfts.fetchSubscribers(wallet);

    if (subscribers.length > 0) {
      await Promise.all(
        subscribers.map(async (newdata) => {
          console.log(newdata.subscribe_to, "wallet");
          const [feeds] = await nfts.fetchFeeds(newdata.subscribe_to);

          await feeds.map((rowsData) => {
            let data = {
              id: rowsData.nft_id,
              tokenId: rowsData.tokenId,
              title: rowsData.title,
              description: rowsData.description,
              image: rowsData.image,
              video: rowsData.video,
              sale: rowsData.sale,
              subscribe: true,
              explicityContent: rowsData.nftType,
              isAuction: rowsData.auction,
              auctionId: rowsData.auctionId,
              reservePrice: rowsData.reservePrice,
              highestBid: rowsData.highestBid,
              bidderAddress: rowsData.bidderAddress,
              bidderUsername: rowsData.bidderUsername,
              bidderImage: rowsData.bidderImage,
              endTimeInSeconds: rowsData.endTimeInSeconds,
              isFixedPrice: rowsData.fixedprice,
              orderId: rowsData.orderId,
              fixedprice: rowsData.fixPrice,
              categoryId: rowsData.cat_id,
              categoryName: rowsData.cat_name,
              categoryDescription: rowsData.cat_description,
              categoryImage: rowsData.cat_img,
              creatorId: rowsData.creatorID,
              creatorName: rowsData.username,
              creatorWallet: rowsData.walletAddress,
              creatorImg: rowsData.img,
              ownerId: rowsData.ownerId,
              ownerName: rowsData.ownerUsername,
              ownerWallet: rowsData.ownerWallet,
              ownerImg: rowsData.ownerImg,
              createdAt: rowsData.created_at,
            };
            nftData.push(data);
          });
        })
      );

      return res.status(201).json({
        // totalPages: totalPages,
        // currentPage: pageNo,
        nftData: nftData,
      });
    } else {
      return next({ code: 404, message: "no data found" });
    }
  } catch (error) {
    console.log(error.message);
    return next({ code: 401, message: error.message });
  }
};
const checkEmail = async (req, res, next) => {
  let email = req.params.email;

  try {
    const [result] = await creators.checkEmail(email);
    if (result.length > 0) {
      return res.status(409).json({ emailAvailable: false });
    } else {
      return res.status(200).json({ emailAvailable: true });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};
const checkWallet = async (req, res, next) => {
  let wallet = req.params.wallet;

  try {
    const [result] = await creators.checkWallet(wallet);

    if (result.length > 0) {
      return res.status(409).json({ walletAvailable: false });
    } else {
      return res.status(200).json({ walletAvailable: true });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};
const checkUserName = async (req, res, next) => {
  let username = req.params.username;

  try {
    const [result] = await creators.checkUserName(username);
    if (result.length > 0) {
      return res.status(409).json({ userNameAvailable: false });
    } else {
      return res.status(200).json({ userNameAvailable: true });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};

const signUp = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
    
    
  ,
     * - `walletAddress`,
   
 
     */
  let payload = req.params;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next({
      code: 401,
      message: errors,
    });
  }

  if (payload.walletAddress) {
    try {
      const result = await creators.singUp(payload);
      if (result) {
        return res.status(201).json({ message: " Registered Successfully" });
      } else {
        return next({ code: 404, message: "no data found" });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};

const logIn = async (req, res, next) => {
  let wallet = req.body.walletAddress;
  const reqBodySchema = Joi.object({
    walletAddress: Joi.string()
      .required()
      .pattern(/^0x[a-fA-F0-9]{40}$/),
  }).options({ abortEarly: false, allowUnknown: false });
  const { error } = reqBodySchema.validate({
    walletAddress: wallet,
  });
  if (error) {
    return res.status(401).json("invalid wallet");
  }
  try {
    const [data] = await creators.checkWallet(wallet);
    if (data.length > 0) {
      return res.status(201).json(data[0]);
    } else {
      const [result] = await creators.singUp(wallet);
      const [data] = await creators.checkWallet(wallet);
      if (data.length > 0) {
        res.status(201).json(data[0]);
      } else {
        console.log("error on signup");
      }
    }
  } catch (err) {
    return next({ code: 401, message: err.message });
  }
};

const checkSession = async (req, res, next) => {
  const { wallet } = req.params;

  if (!wallet) {
    return next({ code: 400, message: "No Request Found" });
  }
  try {
    // console.log(password);
    const [data] = await creators.fetchSingle(wallet);
    if (data.length > 0) {
      return res.status(200).json({ userInfo: data[0] });
    } else {
      return next({ code: 404, message: "user not found" });
    }
  } catch (err) {
    return next({ code: 401, message: err });
  }
};
const generateImage = async (req, res, next) => {
  const puppeteer = require("puppeteer");
  let htmlContent = req.body.content;
  const baseUrl = require("./../config/baseUrl");
  if (htmlContent) {
    try {
      async function htmlToImage(htmlContent, outputPath) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set viewport to be large enough to capture the entire HTML content
        await page.setViewport({ width: 550, height: 450 });

        // Set the HTML content of the page
        await page.setContent(htmlContent);

        // Capture a screenshot of the rendered HTML content
        await page.screenshot({ path: outputPath });

        // Close the browser
        await browser.close();
      }
      const imageName = `${Date.now()}.png`;
      const outputPath = `${baseUrl}public/images/nfts/${imageName}`; // Output file path

      htmlToImage(htmlContent, outputPath)
        .then(() => res.status(200).json({ image: imageName }))
        .catch((error) => console.error("Error:", error));
    } catch (err) {
      return next({ code: 401, message: err.message });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};

module.exports = {
  editPrice: editPrice,
  subscribe: subscribe,
  userLogin: logIn,
  signUp: signUp,
  checkEmail: checkEmail,
  checkUserName: checkUserName,
  checkWallet: checkWallet,
  fetchAllNfts: fetchAllNfts,
  getAllCategories: getAllCategories,
  fetchAllNftsWithCatId: fetchAllNftsWithCatId,
  getSingleArt: getSingleArt,
  allCreators: allCreators,
  singleCreator: singleCreator,
  updateCreatorInfo: updateCreatorInfo,
  inWalletArts: inWalletArts,
  updateProfilePic: updateProfilePic,
  updateCoverPic: updateCoverPic,
  getAllNftsData: getAllNftsData,
  getFeeds: getFeeds,
  mintArt: mintArt,
  putOnFixedSale: putOnFixedSale,
  updateSalePrice: updateSalePrice,
  cancelFixedPriceSale: cancelFixedPriceSale,
  directTransfer: directTransfer,
  listOnAuction: listOnAuction,
  addBidding: addBidding,
  auctionTransfer: auctionTransfer,
  makeOffer: makeOffer,
  offersMadeByUser: offersMadeByUser,
  offersReceivedByUser: offersReceivedByUser,
  generateImage: generateImage,
  checkSession: checkSession,
};
