// npm i express
// 導入 express 這個模組

const express = require('express');

const app = express();

app.get('/', (req, res, next) => {
  res.send('首頁');
});
// http request
// method: get post put delete

app.get('/about', (req, res, next) => {
  res.send('About me');
});

app.listen(3001, () => {
  console.log('Server listening on 3001');
});
