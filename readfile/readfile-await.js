const fs = require('fs/promises');

// 會回傳給你一個 promise 物件，很像 readfile-promise2 裡的 getReadfilePromise

let readFileAsync = (async function () {
  let fsPromise = await fs.readFile('test.txt', 'utf-8');

  console.log(fsPromise);
})();
