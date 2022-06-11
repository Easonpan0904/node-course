const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');

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
router.post('/register', registerRules, (req, res, next) => {
  // 1. req.params <-- 網址上的路由參數
  // 2. req.query <-- 網址上的 query string
  // 3. req.body <-- 通常是表單用的
  console.log('register:', req.body);

  // 驗證資料
  const validateResult = validationResult(req);
  console.log('validateResult:', validateResult);

  if (!validateResult.isEmpty()) {
    let error = validateResult.array();
    return res.status(400).json(error);
  }
  // TODO:確認 email 有沒有註冊過
  // TODO:密碼雜湊
  // TODO:save to db
  // response

  res.json({ status: 'ok' });
});

module.exports = router;
