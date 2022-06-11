// npm i express
// 導入 express 這個模組

const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

// 使用第三方套件 cors
const cors = require('cors');
app.use(cors());

// 重構 mysql 連線
const pool = require('./utils/db');

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

// express.urlencoded 要讓 express 認得 body 裡面的資料
app.use(express.urlencoded({ extended: true }));
// 要讓 express 認得 json 檔
app.use(express.json());

// 處理靜態資料
// 靜態資料 : html, css, javascript, 圖片, 影片
// express 少數內建的中間件 static
// 方法 1: 不指定網址
app.use(express.static(path.join(__dirname, 'assets')));

// 方法2: 指定網址
app.use('/static', express.static(path.join(__dirname, 'public')));

// 一般中間件
// app.use((request, response, next) => {
//   console.log('我是一個沒有用的中間件 AAAA');
//   next();
//   response.send('我是中間件');
// });

app.get('/', (req, res, next) => {
  res.send('首頁');
});
// http request
// method: get post put delete

app.get('/about', (req, res, next) => {
  res.send('About me');
});

app.get('/error', (req, res, next) => {
  // 發生錯誤，你丟一個錯誤出來
  // throw new Error('測試測試');
  // 或是你的 next 裡有任何參數
  next('我是正確的');
  // --> 都會跳去錯誤處理中間件
});

app.get('/ssr', (req, res, next) => {
  // 會去 views 檔案夾裡找 index.pug
  // 第二個參數: 資料物件，會傳到 pug 那邊去，pug 可以直接使用
  res.render('index', {
    stocks: ['台積電', '長榮', '聯發科'],
  });
});

const StockRouter = require('./routers/stockRouters');
app.use('/api/stocks', StockRouter);

const AuthRouter = require('./routers/authRouter');
app.use('/api/auth', AuthRouter);

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

// nodejs
// -- 內建 filesystem --
// fs.readFile
// -- 第三方套件: axios, cors, express
// npm install axios
// const axios = require('axios')
// -- 自己寫模組 --

// NodeJS 的模組系統 CJS (CommomJS)

// IIFE => CJS => ESM
// CJS --> NodeJS 用 --> 瀏覽器不支援
// ESM --> 瀏覽器會支援
