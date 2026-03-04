const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Auction = sequelize.define('Auction', {
  auctionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  tokenId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  owner_address: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  transactionHash: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  reservePrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  highestBid: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  endTimeInSeconds: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  isSettled: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  highestBidder: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  tableName: 'auctions',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false,
});

module.exports = Auction;
