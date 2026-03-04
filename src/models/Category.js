const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  cat_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cat_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  cat_description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  cat_img: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'categories',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false,
});

module.exports = Category;
