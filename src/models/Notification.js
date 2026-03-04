const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  recieverAddress: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  tokenId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  offerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'notifications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Notification;
