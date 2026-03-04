const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Creator = sequelize.define('Creator', {
  creatorID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  walletAddress: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  firstName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
  img: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  cover: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: 'cover.png',
  },
  portfolio: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  instagram: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  twitter: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  facebook: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  subscrption_price: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  tableName: 'creators',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false,
});

module.exports = Creator;
