const jwt = require("jsonwebtoken");
const Creators = require("../model/creators");
const Nfts = require("../model/nfts");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

let creators = new Creators();
let nfts = new Nfts();
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
      return next({ code: 401, message: error });
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
      const createNotification = await nfts.createNotificationDirectTransfer(
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
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};

const mintArt = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
    
    
   * -  tokenId,
   * -  title,
   * -  description,
   * -  image,
   * -  creatorWallet,
   * -  ownerWallet,
   * -  metadata,
   * -  transactionHash,
   * -  categoryId,
   
 
     */
  let payload = req.body;

  if (payload) {
    try {
      const result = await nfts.mintArt(payload);
      if (result) {
        return res
          .status(201)
          .json({ message: " Minted Successfully", tokenId: payload.tokenId });
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
    if (req.file == undefined) {
      return next({ code: 400, message: "Please upload a file!" });
    }
    let walletAddress = req.body.walletAddress;

    let image = req.file.filename;

    if (walletAddress && image) {
      try {
        const result = await creators.uploadProfilePic(image, walletAddress);
        if (result) {
          return res.status(201).json({ message: "Profile Picture Updated" });
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

const inWalletArts = async (req, res, next) => {
  let wallet = req.params.walletAddress;
  try {
    const createdArts = [];
    const collectedArts = [];
    const [result] = await nfts.createdArts(wallet);
    result.forEach((rowsData) => {
      let data = {
        id: rowsData.nft_id,
        tokenId: rowsData.tokenId,
        title: rowsData.title,
        description: rowsData.description,
        image: rowsData.image,
        sale: rowsData.sale,
        auction: rowsData.auction,
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
      createdArts.push(data);
    });
    const [result1] = await nfts.collectedArts(wallet);
    result1.forEach((rowsData) => {
      let data1 = {
        id: rowsData.nft_id,
        tokenId: rowsData.tokenId,
        title: rowsData.title,
        description: rowsData.description,
        image: rowsData.image,
        sale: rowsData.sale,
        auction: rowsData.auction,
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
    return next({ code: 401, message: error });
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

const singleCreator = async (req, res, next) => {
  let wallet = req.params.walletAddress;
  try {
    const [result] = await creators.fetchSingle(wallet);
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

        return res.status(201).json(data);
      });
    } else {
      return next({ code: 404, message: "no data found" });
    }
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
  let id = req.params.tokenId;
  try {
    const [result] = await nfts.getSingleArt(id);
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
  let wallet = req.params.wallet;

  try {
    const [data] = await creators.checkWallet(wallet);
    if (data.length > 0) {
     
        return res.status(201).json(data[0]);
     
    } else {
      const [result] = await creators.singUp(wallet);
      const [data] = await creators.checkWallet(wallet);
    if (data.length > 0) {
      
         res.status(201).json(data[0]);
      
    }
    else{
      console.log('error on signup');
    }
  }
 } catch (err) {
    return next({ code: 401, message: err.message });
  }
};

const authentication = async (req, res, next) => {
  let email = req.data.data1.email;

  if (email) {
    try {
      // console.log(password);
      const [data] = await user.logIn(email);
      if (data.length > 0) {
        data.forEach((rowsData) => {
          let data1 = {
            id: rowsData.id,
            fullName: rowsData.full_name,
            email: rowsData.email,
            phone: rowsData.phone,
            bussiness_name: rowsData.bussiness_name,
            address: rowsData.address,
          };

          return res.status(201).json({ userInfo: data1 });
        });
      } else {
        return next({ code: 404, message: "Invalid Email or Password" });
      }
    } catch (err) {
      return next({ code: 401, message: err });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};
const generateImage = async (req, res, next) => {
  let htmlContent = req.body.content;

  if (htmlContent) {
    try {
  const puppeteer = require('puppeteer');
     async function convertDivToImage(htmlContent, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Set the viewport size based on the dimensions of the div
  await page.setViewport({
    width: 800,
    height: 600,
  });
  // Set the HTML content of the page to the provided div
  await page.setContent(htmlContent);
  // Capture a screenshot of the div
  await page.screenshot({ path: outputPath });
  await browser.close();
}

let imageName = Date.now() + ".jpg";
const outputPath = `./public/images/nfts/${imageName}`;
convertDivToImage(htmlContent, outputPath)
  .then(() => {
    res.status(201).json({image:imageName});
  })
  .catch((error) => {
    res.status(400).json({error:error.message});
  });
      
    } catch (err) {
      return next({ code: 401, message: err });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};

module.exports = {
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
  generateImage:generateImage,
};
