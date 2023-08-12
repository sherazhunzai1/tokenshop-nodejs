const db = require("../config/database");

module.exports = class Nfts {
  constructor() {}

  fetchAllNfts(start, end) {
    return db.execute(`SELECT  n.*, c.*, cr.creatorID, cr.walletAddress,cr.username,cr.img, ow.creatorID as ownerId, ow.username as ownerUsername, ow.walletAddress as ownerWallet, ow.img as ownerImg,fp.orderId,fp.tokenId as fixedToken,fp.transactionHash as fixedHash,fp.price as fixPrice,fp.status as fixedStatus,ac.auctionId,ac.tokenId as aucTokenId,ac.reservePrice,ac.highestBid,ac.endTimeInSeconds,ac.highestBidder,ac.status as aucStatus, bd.walletAddress as bidderAddress,bd.username as bidderUsername,bd.img as bidderImage
    FROM  nfts n
    LEFT JOIN categories c
      ON
    (n.categoryId = c.cat_id)
    LEFT JOIN fixedprice fp
    ON
    (n.tokenId = fp.tokenId
      AND
    fp.status = 1)
    LEFT JOIN auctions ac
    ON
    (n.tokenId = ac.tokenId
      AND
      ac.status = 1)
      LEFT JOIN creators bd 
      ON
      (bd.walletAddress = ac.highestBidder)
    JOIN creators cr 
      ON
    (cr.walletAddress = n.creatorWallet)
    JOIN creators ow 
      ON
    (ow.walletAddress = n.ownerWallet)
    ORDER BY n.created_at DESC
    LIMIT ${start}, ${end}
    
     `);
  }
  fetchAllNftsCount() {
    return db.execute(`SELECT  n.*, c.*, cr.creatorID, cr.walletAddress,cr.username,cr.img, ow.creatorID as ownerId, ow.username as ownerUsername, ow.walletAddress as ownerWallet, ow.img as ownerImg,fp.orderId,fp.tokenId as fixedToken,fp.transactionHash as fixedHash,fp.price as fixPrice,fp.status as fixedStatus,ac.auctionId,ac.tokenId as aucTokenId,ac.reservePrice,ac.highestBid,ac.endTimeInSeconds,ac.highestBidder,ac.status as aucStatus, bd.walletAddress as bidderAddress,bd.username as bidderUsername,bd.img as bidderImage
    FROM  nfts n
    LEFT JOIN categories c
      ON
    (n.categoryId = c.cat_id)
    LEFT JOIN fixedprice fp
    ON
    (n.tokenId = fp.tokenId
      AND
    fp.status = 1)
    LEFT JOIN auctions ac
    ON
    (n.tokenId = ac.tokenId
      AND
      ac.status = 1)
      LEFT JOIN creators bd 
      ON
      (bd.walletAddress = ac.highestBidder)
    JOIN creators cr 
      ON
    (cr.walletAddress = n.creatorWallet)
    JOIN creators ow 
      ON
    (ow.walletAddress = n.ownerWallet)
    ORDER BY n.created_at DESC
    
     `);
  }
  fetchNftsWithCategoryId(id, start, end) {
    return db.execute(`SELECT  n.*, c.*, cr.creatorID, cr.walletAddress,cr.username,cr.img, ow.creatorID as ownerId, ow.username as ownerUsername, ow.walletAddress as ownerWallet, ow.img as ownerImg,fp.orderId,fp.tokenId as fixedToken,fp.transactionHash as fixedHash,fp.price as fixPrice,fp.status as fixedStatus,ac.auctionId,ac.tokenId as aucTokenId,ac.reservePrice,ac.highestBid,ac.endTimeInSeconds,ac.highestBidder,ac.status as aucStatus, bd.walletAddress as bidderAddress,bd.username as bidderUsername,bd.img as bidderImage
    FROM  nfts n
    LEFT JOIN categories c
      ON
    (n.categoryId = c.cat_id)
    LEFT JOIN fixedprice fp
    ON
    (n.tokenId = fp.tokenId
      AND
    fp.status = 1)
    LEFT JOIN auctions ac
    ON
    (n.tokenId = ac.tokenId
      AND
      ac.status = 1)
      LEFT JOIN creators bd 
      ON
      (bd.walletAddress = ac.highestBidder)
    JOIN creators cr 
      ON
    (cr.walletAddress = n.creatorWallet)
    JOIN creators ow 
      ON
    (ow.walletAddress = n.ownerWallet)
    WHERE
    c.cat_id = '${id}'
    LIMIT ${start} , ${end}
    
     `);
  }
  fetchNftsWithCategoryIdCount(id) {
    return db.execute(`SELECT  n.*, c.*, cr.creatorID, cr.walletAddress,cr.username,cr.img, ow.creatorID as ownerId, ow.username as ownerUsername, ow.walletAddress as ownerWallet, ow.img as ownerImg,fp.orderId,fp.tokenId as fixedToken,fp.transactionHash as fixedHash,fp.price as fixPrice,fp.status as fixedStatus,ac.auctionId,ac.tokenId as aucTokenId,ac.reservePrice,ac.highestBid,ac.endTimeInSeconds,ac.highestBidder,ac.status as aucStatus, bd.walletAddress as bidderAddress,bd.username as bidderUsername,bd.img as bidderImage
    FROM  nfts n
    LEFT JOIN categories c
      ON
    (n.categoryId = c.cat_id)
    LEFT JOIN fixedprice fp
    ON
    (n.tokenId = fp.tokenId
      AND
    fp.status = 1)
    LEFT JOIN auctions ac
    ON
    (n.tokenId = ac.tokenId
      AND
      ac.status = 1)
      LEFT JOIN creators bd 
      ON
      (bd.walletAddress = ac.highestBidder)
    JOIN creators cr 
      ON
    (cr.walletAddress = n.creatorWallet)
    JOIN creators ow 
      ON
    (ow.walletAddress = n.ownerWallet)
    WHERE
    c.cat_id = '${id}'

    
     `);
  }
  getSingleArt(tokenId) {
    return db.execute(`SELECT  n.*, c.*, cr.creatorID, cr.walletAddress,cr.username,cr.img, ow.creatorID as ownerId, ow.username as ownerUsername, ow.walletAddress as ownerWallet, ow.img as ownerImg,fp.orderId,fp.tokenId as fixedToken,fp.transactionHash as fixedHash,fp.price as fixPrice,fp.status as fixedStatus,ac.auctionId,ac.tokenId as aucTokenId,ac.reservePrice,ac.highestBid,ac.endTimeInSeconds,ac.highestBidder,ac.status as aucStatus, bd.walletAddress as bidderAddress,bd.username as bidderUsername,bd.img as bidderImage
    FROM  nfts n
    LEFT JOIN categories c
      ON
    (n.categoryId = c.cat_id)
    LEFT JOIN fixedprice fp
    ON
    (n.tokenId = fp.tokenId
      AND
    fp.status = 1)
    LEFT JOIN auctions ac
    ON
    (n.tokenId = ac.tokenId
      AND
      ac.status = 1)
      LEFT JOIN creators bd 
      ON
      (bd.walletAddress = ac.highestBidder)
    JOIN creators cr 
      ON
    (cr.walletAddress = n.creatorWallet)
    JOIN creators ow 
      ON
    (ow.walletAddress = n.ownerWallet)
    WHERE
    n.tokenId  = ${tokenId}
    
     `);
  }
  fetchCategories() {
    return db.execute(`SELECT * FROM categories
     `);
  }

  createdArts(walletAddress) {
    return db.execute(`SELECT  n.*, c.*, cr.creatorID, cr.walletAddress,cr.username,cr.img, ow.creatorID as ownerId, ow.username as ownerUsername, ow.walletAddress as ownerWallet, ow.img as ownerImg FROM  nfts n, categories c, creators cr, creators ow 
    WHERE n.categoryId = c.cat_id
    AND
    cr.walletAddress = n.creatorWallet
    AND
    ow.walletAddress = n.ownerWallet
    AND
    n.creatorWallet = '${walletAddress}'
    
     `);
  }
  collectedArts(walletAddress) {
    return db.execute(`SELECT  n.*, c.*, cr.creatorID, cr.walletAddress,cr.username,cr.img, ow.creatorID as ownerId, ow.username as ownerUsername, ow.walletAddress as ownerWallet, ow.img as ownerImg FROM  nfts n, categories c, creators cr, creators ow 
    WHERE n.categoryId = c.cat_id
    AND
    cr.walletAddress = n.creatorWallet
    AND
    ow.walletAddress = n.ownerWallet
    AND
    n.ownerWallet = '${walletAddress}'
    AND
    n.creatorWallet != '${walletAddress}'
    
     `);
  }
  fetchAllDataFilter(start, end, categoryId, search) {
    // let catFilter = "";
    // if (categoryId) {
    //   catFilter = `WHERE c.cat_id = ${categoryId}`;
    // }
    let catFilter = categoryId ? `AND c.cat_id = ${categoryId}` : "";
    let searchFilter = search ? `AND n.title LIKE '%${search}%' ` : "";
    return db.execute(`SELECT  n.*, c.*, cr.creatorID, cr.walletAddress,cr.username,cr.img, ow.creatorID as ownerId, ow.username as ownerUsername, ow.walletAddress as ownerWallet, ow.img as ownerImg,fp.orderId,fp.tokenId as fixedToken,fp.transactionHash as fixedHash,fp.price as fixPrice,fp.status as fixedStatus,ac.auctionId,ac.tokenId as aucTokenId,ac.reservePrice,ac.highestBid,ac.endTimeInSeconds,ac.highestBidder,ac.status as aucStatus, bd.walletAddress as bidderAddress,bd.username as bidderUsername,bd.img as bidderImage
    FROM  nfts n
    LEFT JOIN categories c
      ON
    (n.categoryId = c.cat_id)
    LEFT JOIN fixedprice fp
    ON
    (n.tokenId = fp.tokenId
      AND
    fp.status = 1)
    LEFT JOIN auctions ac
    ON
    (n.tokenId = ac.tokenId
      AND
      ac.status = 1)
      LEFT JOIN creators bd 
      ON
      (bd.walletAddress = ac.highestBidder)
    JOIN creators cr 
      ON
    (cr.walletAddress = n.creatorWallet)
    JOIN creators ow 
      ON
    (ow.walletAddress = n.ownerWallet)
        WHERE 
        n.status = 1
            ${catFilter}
            ${searchFilter}
            ORDER BY n.created_at DESC
    LIMIT ${start}, ${end}
    
     `);
  }
  fetchAllDataFilterCount(categoryId, search) {
    // let catFilter = "";
    // if (categoryId) {
    //   catFilter = `WHERE c.cat_id = ${categoryId}`;
    // }
    let catFilter = categoryId ? `AND c.cat_id = ${categoryId}` : "";
    let searchFilter = search ? `AND n.title LIKE '%${search}%' ` : "";

    return db.execute(`SELECT  n.*, c.*, cr.creatorID, cr.walletAddress,cr.username,cr.img, ow.creatorID as ownerId, ow.username as ownerUsername, ow.walletAddress as ownerWallet, ow.img as ownerImg,fp.orderId,fp.tokenId as fixedToken,fp.transactionHash as fixedHash,fp.price as fixPrice,fp.status as fixedStatus,ac.auctionId,ac.tokenId as aucTokenId,ac.reservePrice,ac.highestBid,ac.endTimeInSeconds,ac.highestBidder,ac.status as aucStatus, bd.walletAddress as bidderAddress,bd.username as bidderUsername,bd.img as bidderImage
    FROM  nfts n
    LEFT JOIN categories c
      ON
    (n.categoryId = c.cat_id)
    LEFT JOIN fixedprice fp
    ON
    (n.tokenId = fp.tokenId
      AND
    fp.status = 1)
    LEFT JOIN auctions ac
    ON
    (n.tokenId = ac.tokenId
      AND
      ac.status = 1)
      LEFT JOIN creators bd 
      ON
      (bd.walletAddress = ac.highestBidder)
    JOIN creators cr 
      ON
    (cr.walletAddress = n.creatorWallet)
    JOIN creators ow 
      ON
    (ow.walletAddress = n.ownerWallet)
    WHERE 
        n.status = 1
      ${catFilter}
      ${searchFilter}
      ORDER BY n.created_at DESC
     `);
  }
  mintArt({
    tokenId,
    title,
    description,
    image,
    creatorWallet,
    ownerWallet,
    metadata,
    transactionHash,
    categoryId,
    socialMediaImage,
    artistImage,
    titleImage,
    nftType

  },video) {
    return db.execute(`INSERT INTO nfts SET tokenId = ${tokenId}, title = '${title}', description = '${description}', image = '${image}', creatorWallet = '${creatorWallet}', ownerWallet = '${ownerWallet}',sale = '${metadata}', transactionHash = '${transactionHash}',categoryId = ${categoryId},video='${video}',socialMediaImage='${socialMediaImage}',artistImage='${artistImage}',titleImage='${titleImage}',nftType='${nftType}'
`);
  }
  putOnFixedSale({ orderId, tokenId, transactionHash, ownerWallet, price }) { 
    return db.execute(`INSERT INTO fixedprice SET orderId = '${orderId}', tokenId = ${tokenId}, transactionHash = '${transactionHash}', owner = '${ownerWallet}', price = '${price}'
`);
  }
  updateStatusOfNFT(tokenId) {
    return db.execute(`UPDATE nfts SET sale = 1,fixedprice = 1
    WHERE
    tokenId = ${tokenId}
`);
  }
  updateSalePrice({ orderId, tokenId, price }) {
    return db.execute(`UPDATE fixedprice SET price = '${price}'
    WHERE
    orderId = ${orderId}
    AND
    tokenId = ${tokenId}
`);
  }
  cancelFixedPriceSale({ orderId, tokenId }) {
    return db.execute(`DELETE FROM fixedprice
    WHERE
    orderId = ${orderId}
    AND
    tokenId = ${tokenId}
`);
  }
  resetNFTStatus(tokenId) {
    return db.execute(`UPDATE nfts SET sale = 0,fixedprice = 0, auction = 0
    WHERE
    tokenId = ${tokenId}
`);
  }
  directTransfer({
    transferFrom,
    transferTo,
    amount,
    tokenId,
    orderId,
    transferHash,
  }) {
    return db.execute(`INSERT INTO transfernft SET transferFrom = '${transferFrom}',transferTo = '${transferTo}', amount = '${amount}',tokenId = ${tokenId},transferType = 'DirectTransfer',tranferReferenceId = ${orderId},transferHash = '${transferHash}'
`);
  }

  updateOwnerAfterDirectTransfer(tokenId, transferTo) {
    return db.execute(`UPDATE nfts SET ownerWallet = '${transferTo}'
    WHERE
    tokenId = ${tokenId}
`);
  }
  updateFixedTable(tokenId, orderId) {
    return db.execute(`UPDATE fixedprice SET onSale = 0, isSold = 1, status = 0
    WHERE
    tokenId = ${tokenId}
    AND
    orderId = ${orderId}
`);
  }
  createNotificationDirectTransfer(transferTo, tokenId) {
    return db.execute(`INSERT INTO notifications SET recieverAddress = '${transferTo}', tokenId = ${tokenId},type = "directTransfer"
`);
  }
  listOnAuction({
    auctionId,
    tokenId,
    transactionHash,
    ownerWallet,
    reservePrice,
  }) {
    return db.execute(`INSERT INTO auctions SET auctionId = ${auctionId}, tokenId = ${tokenId}, transactionHash = '${transactionHash}', owner_address = '${ownerWallet}', reservePrice = '${reservePrice}'
`);
  }
  updateStatusOfNFTtoAuction(tokenId) {
    return db.execute(`UPDATE nfts SET sale = 1,auction = 1
    WHERE
    tokenId = ${tokenId}
`);
  }
  updateBiddingOnAuction(
    tokenId,
    auctionId,
    highestBid,
    endTimeInSeconds,
    highestBidder
  ) {
    return db.execute(`UPDATE auctions SET highestBid = '${highestBid}' ,endTimeInSeconds = '${endTimeInSeconds}',highestBidder = '${highestBidder}'
    WHERE
    tokenId = ${tokenId}
    AND
    auctionId = ${auctionId}
`);
  }
  addBidding(auctionId, highestBidder, txHash, highestBid) {
    return db.execute(`INSERT INTO biddings SET auction_id = ${auctionId}, bidder_id = '${highestBidder}', transferHash = '${txHash}', price = '${highestBid}'
`);
  }
  auctionTransfer({
    transferFrom,
    transferTo,
    amount,
    tokenId,
    auctionId,
    transferHash,
  }) {
    return db.execute(`INSERT INTO transfernft SET transferFrom = '${transferFrom}',transferTo = '${transferTo}', amount = '${amount}',tokenId = ${tokenId},transferType = 'AuctionWon',tranferReferenceId = ${auctionId},transferHash = '${transferHash}'
`);
  }
  createNotificationAuctionTransfer(transferTo, tokenId) {
    return db.execute(`INSERT INTO notifications SET recieverAddress = '${transferTo}', tokenId = ${tokenId},type = "AuctionWon"
`);
  }
  resetAuctionTable(tokenId, auctionId) {
    return db.execute(`UPDATE auctions SET isSettled = 1,status = 0
    WHERE
    tokenId = ${tokenId}
    AND
    auctionId = ${auctionId}
`);
  }
  makeOffer({ offerId, tokenId, senderAddress, receiverAddress, offerPrice }) {
    return db.execute(`INSERT INTO offers SET offerId = ${offerId}, tokenId = ${tokenId},sender_address = '${senderAddress}',reciever_address = '${receiverAddress}', offer_price = '${offerPrice}'
`);
  }
  offerReceivedNotification(receiverAddress, tokenId, offerId, type) {
    return db.execute(`INSERT INTO notifications SET recieverAddress = '${receiverAddress}', tokenId = ${tokenId},offerId = ${offerId}, type = '${type}'
`);
  }
  offersReceivedByUser(walletAddress) {
    return db.execute(`SELECT o.status,o.created_at,o.offerId,o.sender_address,o.reciever_address,o.tokenId,o.offer_price,om.username as offerMadeByName, om.walletAddress as offerMadeByWalletAddress,om.img as offerMadeByImage, ow.username, ow.walletAddress, ow.img, n.tokenId, n.title, n.image, n.creatorWallet, n.ownerWallet 
    FROM nfts n, creators om, creators ow, offers o
    WHERE
      o.tokenId = n.tokenId
      AND
      o.sender_address = om.walletAddress
      AND
      o.reciever_address = ow.walletAddress
      AND
      o.reciever_address = n.ownerWallet
      AND
      o.status = "pending"
      AND
      o.reciever_address = '${walletAddress}'

    `);
  }
  offersMadeByUser(walletAddress) {
    return db.execute(`
    SELECT o.status,o.created_at,o.offerId,o.sender_address,o.reciever_address,o.tokenId,o.offer_price,om.username as ownerName, om.walletAddress as ownerWallet,om.img as ownerImg, ow.username, ow.walletAddress, ow.img, n.tokenId, n.title, n.image, n.creatorWallet, n.ownerWallet 
    FROM nfts n, creators om, creators ow, offers o
    WHERE
      o.tokenId = n.tokenId
      AND
      om.walletAddress = n.ownerWallet
      AND
      ow.walletAddress = n.creatorWallet
      AND
      o.sender_address = '${walletAddress}'
    `);
  }
  acceptOffer({
    transferFrom,
    transferTo,
    amount,
    tokenId,
    offerId,
    transferHash,
  }) {
    return db.execute(`INSERT INTO transfernft SET transferFrom = '${transferFrom}',transferTo = '${transferTo}', amount = '${amount}',tokenId = ${tokenId},transferType = 'AuctionWon',tranferReferenceId = ${offerId},transferHash = '${transferHash}'
`);
  }
};
