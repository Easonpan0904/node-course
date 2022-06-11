// 建立一個 routers 檔案夾
// 在 routers 裡，建立一個 stockRouter.js

const express = require('express');
const router = express.Router();

// router is a mini-app

const pool = require('../utils/db');

// REST API
// 取得 stocks 的列表

router.get('/', async (req, res, next) => {
  let [data, fields] = await pool.execute('SELECT * FROM stocks');
  res.json(data);
});

// 取得某個股票 id 的資料
router.get('/:stockId', async (req, res, next) => {
  // 取得網址上的參數 req.params
  // req.params.stockId

  // 直接使用SQL的語法會造成 SQL injection 的問題
  // let [data, fields] = await pool.execute(`SELECT * FROM stocks WHERE id = ${req.params.stockId}`);

  // mysql2 套件利用 prepared statement 就能避免掉 sql injection
  // let [data, fields] = await pool.execute(`SELECT * FROM stock_prices WHERE stock_id = ?`, [req.params.stockId]);

  // 空資料(查不到資料)有兩種處理方式：
  // 1. status:200 response: []
  // 2. status:404 response: not found.

  // RESTful API 把過濾參數放在 query params
  // /stocks/:stockId?page=1
  // 取得目前在第幾頁, 利用 || 的特性來做預設值
  // 如果 page 沒有值會直接取用預設值 1
  let page = req.query.page || 1;
  // console.log('page:', page);

  // 取得目前的總筆數
  let [allResults, fields] = await pool.execute(`SELECT * FROM stock_prices WHERE stock_id = ?`, [req.params.stockId]);
  const total = allResults.length;
  // console.log('total', total);

  // 取得總共有幾頁
  const perPage = 5;
  const lastPage = Math.ceil(total / perPage);
  // console.log('lastPage', lastPage);

  // 計算 offset 是多少
  let offset = (page - 1) * perPage;
  // console.log('offset', offset);

  // 取得這一頁的資料
  let [pageResult, pageFields] = await pool.execute(`SELECT * FROM stock_prices WHERE stock_id = ? ORDER BY date DESC LIMIT ? OFFSET ?`, [req.params.stockId, perPage, offset]);

  // test case
  // 正面: 沒有page, page=1, page=2, page = 12
  // 負面: page=-1, page=13, page=空白

  // TODO: 回覆給前端

  if (pageResult.length === 0) {
    res.status(404).send('not found');
  } else {
    res.json({
      // 用來儲存所有跟頁碼有關的資訊
      pagination: {
        lastPage,
        total,
        page,
      },
      // 真正的資料
      data: pageResult,
    });
  }
});

module.exports = router;
