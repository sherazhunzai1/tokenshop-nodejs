const sequelize = require('../config/database');
const Creator = require('./Creator');
const Nft = require('./Nft');
const Category = require('./Category');
const FixedPrice = require('./FixedPrice');
const Auction = require('./Auction');
const Bidding = require('./Bidding');
const Offer = require('./Offer');
const TransferNft = require('./TransferNft');
const Subscription = require('./Subscription');
const Notification = require('./Notification');

// NFT associations
Nft.belongsTo(Category, { foreignKey: 'categoryId', targetKey: 'cat_id', as: 'category' });
Nft.belongsTo(Creator, { foreignKey: 'creatorWallet', targetKey: 'walletAddress', as: 'creator' });
Nft.belongsTo(Creator, { foreignKey: 'ownerWallet', targetKey: 'walletAddress', as: 'owner' });

Nft.hasOne(FixedPrice, { foreignKey: 'tokenId', sourceKey: 'tokenId', as: 'fixedPriceListing' });
Nft.hasOne(Auction, { foreignKey: 'tokenId', sourceKey: 'tokenId', as: 'auctionListing' });

// Auction associations
Auction.belongsTo(Creator, { foreignKey: 'highestBidder', targetKey: 'walletAddress', as: 'bidder' });

module.exports = {
  sequelize,
  Creator,
  Nft,
  Category,
  FixedPrice,
  Auction,
  Bidding,
  Offer,
  TransferNft,
  Subscription,
  Notification,
};
