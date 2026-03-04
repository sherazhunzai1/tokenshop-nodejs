const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FixedPrice = sequelize.define('FixedPrice', {
  saleId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderId: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  tokenId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  transactionHash: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  owner: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  onSale: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  isSold: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isCanceled: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  tableName: 'fixedprice',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false,
});

module.exports = FixedPrice;
