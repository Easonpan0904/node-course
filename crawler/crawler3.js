// await version
// 1. read stock no from file (fs)
// 2. axios.get to request data
const axios = require('axios');
const fs = require('fs/promises');

(async () => {
  try {
    let stockNo = await fs.readFile('stock.txt', 'utf-8');
    let response = await axios.get('https://www.twse.com.tw/exchangeReport/STOCK_DAY', {
      params: {
        // 設定 query string
        response: 'json',
        date: '20220301',
        stockNo: stockNo,
      },
    });
    console.log('利用async&await方法爬出證交所資訊', response.data);
  } catch (err) {
    console.error('錯誤命令', err);
  }
})();
