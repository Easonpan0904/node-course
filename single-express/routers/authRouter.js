const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');

// 啟用密碼雜湊
const bcrypt = require('bcrypt');

// 啟用資料庫
const pool = require('../utils/db');

// for image upload
const multer = require('multer');
const path = require('path');
// 圖片上傳需要地方放，在 public 裡，建立了 uploads 檔案夾
// 設定圖片儲存的位置

const storage = multer.diskStorage({
  // 設定儲存的目的地 {檔案夾}
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, '..', 'public', 'members'));
  },
  // 重新命名使用者上傳的圖片名稱
  filename: function (req, file, callback) {
    // console.log('multer filename', file);
    let ext = file.originalname.split('.').pop();
    let newFileName = Date.now() + `.${ext}`;
    callback(null, newFileName);
    // {
    //   fieldname: 'photo',
    //   originalname: 'japan04-200.jpg',
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg'
    // }
  },
});

const upload = multer({
  // 設定儲存的位置
  storage: storage,
  // 過濾圖片
  fileFilter: function (req, file, callback) {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png') {
      callback('這些為不被接受的格式', false);
    } else {
      callback(null, true);
    }
  },
  // 檔案尺寸的過濾
  limits: {
    fileSize: 200 * 1024,
  },
});

const registerRules = [
  body('email').isEmail().withMessage('Email 未填寫正確'),
  body('password').isLength({ min: 8 }).withMessage('密碼長度至少為8'),
  body('confirmPassword')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('密碼驗證不一致'),
];

// /api/auth/register
router.post('/register', upload.single('photo'), registerRules, async (req, res, next) => {
  // 1. req.params <-- 網址上的路由參數
  // 2. req.query <-- 網址上的 query string
  // 3. req.body <-- 通常是表單用的
  console.log('register:', req.body);

  // 驗證資料
  const validateResult = validationResult(req);
  // console.log('validateResult:', validateResult);

  if (!validateResult.isEmpty()) {
    let error = validateResult.array();
    return res.status(400).json({ code: 3001, error: error });
  }

  // 確認 email 有沒有註冊過
  let [members] = await pool.execute('SELECT id,email FROM members WHERE email = ?', [req.body.email]);
  // 這個 email 有註冊過
  if (members.length !== 0) {
    return res.status(400).json({ code: 3002, error: '這個email已註冊' });
  }
  // 盡可能讓後端回覆的格式是一致的，如果無法一致，也要讓前端有個判斷的依據
  // 做專案的時候，在專案開始前，可以先討論好要回覆的錯誤格式與代碼

  // 密碼雜湊
  let hashPassword = await bcrypt.hash(req.body.password, 10);
  // console.log('hashPassword', hashPassword);

  // 圖片處理完成後，會被放在 req 物件裡
  console.log('req.file', req.file);

  // 前端最終需要的網址: http://localhost:3001/public/members/團片名稱.jpg
  // 可以由後端來組合這個網址, 也可以由前端組合
  // 記得不可以存 http://localhost:3001/ 進資料庫, 正式環境不同
  // 目前採用: 儲存 /members/團片名稱.jpg 的格式
  // 使用者不一定有上傳圖片, 需要額外做判斷
  let photo = req.file ? '/members/' + req.file.filename : '';

  // save to db
  let [result] = await pool.execute('INSERT INTO members (email, password, name, photo) VALUES (?, ?, ?, ?)', [req.body.email, hashPassword, req.body.name, photo]);
  console.log('insert result', result);

  // response
  res.json({ code: 0, result: 'ok' });
});

router.post('/login', async (req, res, next) => {
  // 有沒有收到資料
  // console.log(req.body);
  // 確認有沒有這個帳號
  // 確認 email 有沒有註冊過
  let [members] = await pool.execute('SELECT * FROM members WHERE email = ?', [req.body.email]);
  // 這個 email 沒有註冊過
  if (members.length === 0) {
    // 如果沒有，就回覆錯誤
    return res.status(400).json({ code: 3003, error: '帳號或密碼錯誤' });
  }

  //如果程式碼執行到這，表示 members 裡至少有一個資料

  let member = members[0];

  // 如果有，確認密碼
  let passwordCompareResult = await bcrypt.compare(req.body.password, member.password);

  // 如果密碼不符合，回覆登入錯誤
  if (passwordCompareResult === false) {
    return res.status(400).json({ code: 3004, error: '帳號或密碼錯誤' });
  }
  // 密碼符合，就開始寫 session (是用 session / cookie 的方式完成) --> 可用 jwt 取代
  let returnMember = { email: member.email, name: member.name, photo: member.photo };
  req.session.member = returnMember;
  // 回覆資料給前端
  res.json({ code: 0, message: 'ok', member: returnMember });
});

router.get('/logout', (req, res, next) => {
  req.session.member = null;
  res.sendStatus(202);
});

module.exports = router;
