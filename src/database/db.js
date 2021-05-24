const Sequelize = require('sequelize');

const {DB_PASS, DB_USER, DB_NAME = 'task_api', DB_HOST = 'localhost'} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  dialect: 'mysql',
  host: DB_HOST,
});

module.exports = sequelize;

// TRASH
// require('mysql2').createPool({
//   connectionLimit: 1000,
//   connectTimeout: 60 * 60 * 1000,
//   acquireTimeout: 60 * 60 * 1000,
//   timeout: 60 * 60 * 1000,
//   host: HOST,
//   user: DB_USER,
//   password: DB_PASS,
//   database: DB_NAME,
// });
