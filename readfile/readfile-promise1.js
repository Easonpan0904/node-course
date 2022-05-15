const fs = require('fs');

// fs.readFile('test11111.txt', 'utf-8', (err, data) => {
//   if (err) {
//     // 錯誤了
//     console.log('喔喔喔，發生錯誤了');
//     console.error(err);
//   } else {
//     // 因為沒有 err，所以是正確的
//     console.log(data);
//   }
// });

let fsPromise = (file) => {
  return new Promise((resolve, reject) => {
    // fs.readFile('test1111.txt', 'utf-8', (err, data) => {
    // error
    fs.readFile(file, 'utf-8', (err, data) => {
      //success
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

fsPromise('test.txt')
  .then((res) => {
    console.log(`resolved: ${res}`);
  })
  .catch((err) => {
    console.error(err);
  });

fsPromise('test111.txt')
  .then((res) => {
    console.log(`resolved: ${res}`);
  })
  .catch((err) => {
    console.error(err);
  });
