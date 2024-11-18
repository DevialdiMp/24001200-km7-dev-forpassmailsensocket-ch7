const express = require('express');
const { dashboardController } = require('../controllers/dashboardController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, dashboardController);

module.exports = router;