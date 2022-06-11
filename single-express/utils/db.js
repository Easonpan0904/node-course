require('dotenv').config();
const mysql = require('mysql2');
// 這裡跟爬蟲不同，不會只建立一個連線
// 但是，也不會幫每個 request 都分別建立連線
// ---->  connection pool

let pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    dateStrings: true,
  })
  .promise();

module.exports = pool;
