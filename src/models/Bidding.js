const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bidding = sequelize.define('Bidding', {
  bidding_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  auction_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bidder_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  transferHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  settlement: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  result: {
    type: DataTypes.STRING(255),
    defaultValue: 'pending',
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  tableName: 'biddings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Bidding;
