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

const doWork = (job, timer) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let dt = new Date();

      let result = `完成工作: ${job} at ${dt.toISOString()}`;
      resolve(result);
      // let dt = new Date();
      // console.log(`完成工作: 吃早餐 at ${dt.toISOString()}`);
    }, timer);
  });
};

// let doBrushPromise = doWork('刷牙', 3000);
// console.log(doWorkPromise);

async function MorningWork() {
  let brushResult = await doWork('刷牙', 3000);
  console.log(brushResult);
  let BfResult = await doWork('吃早餐', 5000);
  console.log(BfResult);
  let HwResult = await doWork('做作業', 3000);
  console.log(HwResult);
}

MorningWork();
