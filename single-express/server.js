// npm i express
// 導入 express 這個模組

const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql2');
require('dotenv').config();

// 使用第三方套件 cors
const cors = require('cors');
app.use(cors());

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
  })
  .promise();

// express 是一個 middleware (中間件)組成的事件
// client -- server
// client send request --> server
//                     <-- response

// request response cycle
// client: browser, postman, nodejs

// 由上而下執行
// 直到 request -> response 循環結束

// express 是一個由 middleware (中間件) 組成的世界
// request --> middleware1 --> middleware2 --> .... --> response
// 中間件的「順序」很重要!!
// Express 是按照你安排的順序去執行誰是 next 的
// middleware 中有兩種結果：
// 1. next: 往下一個中間件去
// 2. response: 結束這次的旅程 (req-res cycle)

// 處理靜態資料
// 靜態資料 : html, css, javascript, 圖片, 影片
// express 少數內建的中間件 static
// 方法 1
app.use(express.static(path.join(__dirname, 'assets')));

// 方法2
app.use('/static', express.static(path.join(__dirname, 'public')));

// 一般中間件
app.use((request, response, next) => {
  console.log('我是一個沒有用的中間件 AAAA');
  next();
  // response.send('我是中間件');
});

app.get('/', (req, res, next) => {
  res.send('首頁');
});
// http request
// method: get post put delete

app.get('/about', (req, res, next) => {
  res.send('About me');
});

// REST API
// 取得 stocks 的列表

app.get('/stocks', async (req, res, next) => {
  let [data, fields] = await pool.execute('SELECT * FROM stocks');
  res.json(data);
});

// 取得某個股票 id 的資料
app.get('/stocks/:stockId', async (req, res, next) => {
  // 取得網址上的參數 req.params
  // req.params.stockId

  let [data, fields] = await pool.execute(`SELECT * FROM stocks WHERE id = ${req.params.stockId}`);

  // 空資料(查不到資料)有兩種處理方式：
  // 1. status:200 response: []
  // 2. status:404 response: not found.

  if (data.length === 0) {
    res.status(200).json(data);
  } else {
    res.json(data);
  }
});

app.get('/error', (req, res, next) => {
  // 發生錯誤，你丟一個錯誤出來
  // throw new Error('測試測試');
  // 或是你的 next 裡有任何參數
  next('我是正確的');
  // --> 都會跳去錯誤處理中間件
});

// 404
// 這個中間件在所有路由的最後
// 循環到這裡表示沒有比對到符合網址的路由中間件
app.use((req, res, next) => {
  console.log('所有路由的最後: 404', req.path);
  res.status('404').send('Not found.');
});

// 5xx
// 錯誤處理的中間件
// 接近 try-catch 的 catch 使用方法
app.use((err, req, res, next) => {
  console.error('伺服器錯誤', err, req.path);
  res.status('500').send('Server Error: ' + err.message);
});

app.listen(3001, () => {
  console.log('Server listening on 3001');
});
