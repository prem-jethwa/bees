
const Sequelize = require('sequelize');
const sequelize = require('../database/db');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  complitedTask: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  totalTask: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

module.exports = User;
