const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Nft = sequelize.define('Nft', {
  nft_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tokenId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  creatorWallet: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  ownerWallet: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  sale: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  auction: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  fixedprice: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  metadata: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  transactionHash: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  video: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  socialMediaImage: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  artistImage: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  titleImage: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  nftType: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  royalityPercentage: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  tableName: 'nfts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Nft;
