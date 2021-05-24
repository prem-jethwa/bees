const Sequelize = require('sequelize');

const {DB_PASS, DB_USER, DB_NAME, DB_HOST} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  dialect: 'mysql',
  host: DB_HOST,
});

module.exports = sequelize;

