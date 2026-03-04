const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Offer = sequelize.define('Offer', {
  offerId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  tokenId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sender_address: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  reciever_address: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  offer_price: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(255),
    defaultValue: 'pending',
  },
}, {
  tableName: 'offers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Offer;
