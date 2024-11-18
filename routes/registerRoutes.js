const express = require('express');
const { registerController } = require('../controllers/registerController');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('register');
});

router.post('/', registerController);

module.exports = router;