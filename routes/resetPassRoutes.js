const express = require('express');
const { resetPassword } = require('../controllers/resetPassController');
const router = express.Router();

router.get('/reset-password', (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('Token reset atau ubah password tidak valid!');
  }

  res.render('reset-password', { token });
});

router.post('/reset-password', resetPassword);

module.exports = router;