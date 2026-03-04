const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TransferNft = sequelize.define('TransferNft', {
  transferId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  transferFrom: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  transferTo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  tokenId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  transferType: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  tranferReferenceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  transferHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'transfernft',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false,
});

module.exports = TransferNft;
