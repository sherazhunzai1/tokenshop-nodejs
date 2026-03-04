const { Nft, FixedPrice, Auction, Bidding, TransferNft, Notification, Offer } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const sequelize = require('../config/database');

// ──────────────────── Fixed Price ────────────────────

const putOnFixedSale = asyncHandler(async (req, res, next) => {
  const { orderId, tokenId, transactionHash, ownerWallet, price } = req.body;
  if (!tokenId) return next({ code: 400, message: 'No Request Found' });

  await sequelize.transaction(async (t) => {
    await FixedPrice.create(
      { orderId, tokenId, transactionHash, owner: ownerWallet, price },
      { transaction: t }
    );
    await Nft.update(
      { sale: 1, fixedprice: 1 },
      { where: { tokenId }, transaction: t }
    );
  });

  return res.status(201).json({ message: 'Success', tokenId });
});

const updateSalePrice = asyncHandler(async (req, res, next) => {
  const { orderId, tokenId, price } = req.body;
  if (!orderId || !tokenId) return next({ code: 400, message: 'No Request Found' });

  const [updated] = await FixedPrice.update(
    { price },
    { where: { orderId, tokenId } }
  );

  if (!updated) return next({ code: 404, message: 'no request found' });

  return res.status(201).json({ message: 'Sale Price Updated', tokenId, price });
});

const cancelFixedPriceSale = asyncHandler(async (req, res, next) => {
  const { orderId, tokenId } = req.body;
  if (!orderId || !tokenId) return next({ code: 400, message: 'No Request Found' });

  await sequelize.transaction(async (t) => {
    await FixedPrice.destroy({ where: { orderId, tokenId }, transaction: t });
    await Nft.update(
      { sale: 0, fixedprice: 0, auction: 0 },
      { where: { tokenId }, transaction: t }
    );
  });

  return res.status(201).json({
    message: 'Successfully Cancelled Fixed Price Sale',
    tokenId,
    price: req.body.price,
  });
});

const directTransfer = asyncHandler(async (req, res, next) => {
  const { transferFrom, transferTo, amount, tokenId, orderId, transferHash } = req.body;
  if (!tokenId) return next({ code: 400, message: 'No Request Found' });

  await sequelize.transaction(async (t) => {
    await TransferNft.create(
      { transferFrom, transferTo, amount, tokenId, transferType: 'DirectTransfer', tranferReferenceId: orderId, transferHash },
      { transaction: t }
    );
    await Nft.update(
      { sale: 0, fixedprice: 0, auction: 0 },
      { where: { tokenId }, transaction: t }
    );
    await FixedPrice.update(
      { onSale: 0, isSold: 1, status: 0 },
      { where: { tokenId, orderId }, transaction: t }
    );
    await Nft.update(
      { ownerWallet: transferTo },
      { where: { tokenId }, transaction: t }
    );
  });

  return res.status(201).json({ message: 'NFT Transferred successfully', tokenId });
});

// ──────────────────── Auction ────────────────────

const listOnAuction = asyncHandler(async (req, res, next) => {
  const { auctionId, tokenId, transactionHash, ownerWallet, reservePrice } = req.body;
  if (!tokenId) return next({ code: 400, message: 'No Request Found' });

  const endTimeInSeconds = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

  await sequelize.transaction(async (t) => {
    await Auction.create(
      { auctionId, tokenId, transactionHash, owner_address: ownerWallet, reservePrice, endTimeInSeconds },
      { transaction: t }
    );
    await Nft.update(
      { sale: 1, auction: 1 },
      { where: { tokenId }, transaction: t }
    );
  });

  return res.status(201).json({ message: 'Listed On Auction Successfylly', tokenId });
});

const addBidding = asyncHandler(async (req, res, next) => {
  const { tokenId, auctionId, highestBid, endTimeInSeconds, highestBidder, txHash } = req.body;
  if (!tokenId) return next({ code: 400, message: 'No Request Found' });

  await sequelize.transaction(async (t) => {
    await Auction.update(
      { highestBid, endTimeInSeconds, highestBidder },
      { where: { tokenId, auctionId }, transaction: t }
    );
    await Bidding.create(
      { auction_id: auctionId, bidder_id: highestBidder, transferHash: txHash, price: highestBid },
      { transaction: t }
    );
  });

  return res.status(201).json({ message: 'Bidded Successfylly', tokenId });
});

const auctionTransfer = asyncHandler(async (req, res, next) => {
  const { transferFrom, transferTo, amount, tokenId, auctionId, transferHash } = req.body;
  if (!tokenId) return next({ code: 400, message: 'No Request Found' });

  await sequelize.transaction(async (t) => {
    await TransferNft.create(
      { transferFrom, transferTo, amount, tokenId, transferType: 'AuctionWon', tranferReferenceId: auctionId, transferHash },
      { transaction: t }
    );
    await Nft.update(
      { sale: 0, fixedprice: 0, auction: 0 },
      { where: { tokenId }, transaction: t }
    );
    await Auction.update(
      { isSettled: 1, status: 0 },
      { where: { tokenId, auctionId }, transaction: t }
    );
    await Notification.create(
      { recieverAddress: transferTo, tokenId, type: 'AuctionWon' },
      { transaction: t }
    );
    await Nft.update(
      { ownerWallet: transferTo },
      { where: { tokenId }, transaction: t }
    );
  });

  return res.status(201).json({ message: 'NFT Transferred successfully', tokenId });
});

// ──────────────────── Offers ────────────────────

const makeOffer = asyncHandler(async (req, res, next) => {
  const { offerId, tokenId, senderAddress, receiverAddress, offerPrice } = req.body;
  if (!tokenId) return next({ code: 400, message: 'No Request Found' });

  await sequelize.transaction(async (t) => {
    await Offer.create(
      { offerId, tokenId, sender_address: senderAddress, reciever_address: receiverAddress, offer_price: offerPrice },
      { transaction: t }
    );
    await Notification.create(
      { recieverAddress: receiverAddress, tokenId, offerId, type: 'offerReceived' },
      { transaction: t }
    );
  });

  return res.status(201).json({ message: 'Offer Made successfully', tokenId, offerId });
});

const offersMadeByUser = asyncHandler(async (req, res, next) => {
  const { walletAddress } = req.params;

  const [results] = await sequelize.query(
    `SELECT o.status, o.created_at, o.offerId, o.sender_address, o.reciever_address, o.tokenId, o.offer_price,
            om.username AS ownerName, om.walletAddress AS ownerWallet, om.img AS ownerImg,
            ow.username, ow.walletAddress, ow.img,
            n.tokenId, n.title, n.image, n.creatorWallet, n.ownerWallet
     FROM nfts n, creators om, creators ow, offers o
     WHERE o.tokenId = n.tokenId
       AND om.walletAddress = n.ownerWallet
       AND ow.walletAddress = n.creatorWallet
       AND o.sender_address = :walletAddress`,
    { replacements: { walletAddress } }
  );

  if (results.length === 0) {
    return next({ code: 404, message: 'no data found' });
  }

  const offersMade = results.map((r) => ({
    tokenId: r.tokenId,
    title: r.title,
    artImg: r.image,
    offerPrice: r.offer_price,
    ownerName: r.ownerName,
    ownerWallet: r.ownerWallet,
    ownerImg: r.ownerImg,
    creatorName: r.username,
    creatorWallet: r.walletAddress,
    creatorImg: r.img,
    status: r.status,
    createdAt: r.created_at,
  }));

  return res.status(201).json({ offersMade });
});

const offersReceivedByUser = asyncHandler(async (req, res, next) => {
  const { walletAddress } = req.params;

  const [results] = await sequelize.query(
    `SELECT o.status, o.created_at, o.offerId, o.sender_address, o.reciever_address, o.tokenId, o.offer_price,
            om.username AS offerMadeByName, om.walletAddress AS offerMadeByWalletAddress, om.img AS offerMadeByImage,
            ow.username, ow.walletAddress, ow.img,
            n.tokenId, n.title, n.image, n.creatorWallet, n.ownerWallet
     FROM nfts n, creators om, creators ow, offers o
     WHERE o.tokenId = n.tokenId
       AND o.sender_address = om.walletAddress
       AND o.reciever_address = ow.walletAddress
       AND o.reciever_address = n.ownerWallet
       AND o.status = 'pending'
       AND o.reciever_address = :walletAddress`,
    { replacements: { walletAddress } }
  );

  if (results.length === 0) {
    return next({ code: 404, message: 'no data found' });
  }

  const offersReceived = results.map((r) => ({
    tokenId: r.tokenId,
    title: r.title,
    artImg: r.image,
    offerPrice: r.offer_price,
    ownerName: r.username,
    ownerWallet: r.walletAddress,
    ownerImg: r.img,
    offerMadeByName: r.offerMadeByName,
    offerMadeByWalletAddress: r.offerMadeByWalletAddress,
    offerMadeByImage: r.offerMadeByImage,
    status: r.status,
    createdAt: r.created_at,
  }));

  return res.status(201).json({ offersReceived });
});

module.exports = {
  putOnFixedSale,
  updateSalePrice,
  cancelFixedPriceSale,
  directTransfer,
  listOnAuction,
  addBidding,
  auctionTransfer,
  makeOffer,
  offersMadeByUser,
  offersReceivedByUser,
};
