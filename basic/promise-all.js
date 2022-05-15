// Promise 是一個表示非同步運算的最終完成或失敗的物件。

// 1. 非同步
// 2. 結果: 「最終」成功, 「最終失敗」
// 3. 物件

// -> 用來解決callback hell

// new Promise(executor);

// new的時候要傳入executor --> executor 也只是一個函式
// function executor(resolve, reject) {
// 非同步工作
// 成功呼叫 resolve
// 失敗呼叫 reject
// }

let dt = new Date();
console.log(`起床了 at ${dt.toISOString()}`);

const doWork = (job) => {
  let timer = parseInt(Math.random() * 5000);
  return new Promise((resolve, reject) => {
    if (job) {
      setTimeout(() => {
        let dt = new Date();

        let result = `完成工作: ${job} at ${dt.toISOString()}`;
        resolve(result);
        // let dt = new Date();
        // console.log(`完成工作: 吃早餐 at ${dt.toISOString()}`);
      }, timer);
    } else {
      let result = '沒輸入工作';
      reject(result);
    }
  });
};

// console.log(doWorkPromise);

let doBrushPromise = doWork('刷牙');
let doEatPromise = doWork('吃早餐');
let doHwPromise = doWork('做作業');
// 測試reject會造成promise.all發生什麼事
let doNothing = doWork('');

Promise.all([doBrushPromise, doEatPromise, doHwPromise, doNothing])
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.error(err);
  });
