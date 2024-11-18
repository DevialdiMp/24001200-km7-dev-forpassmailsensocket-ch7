const express = require('express');
const { sendResetPasswordEmail } = require('../controllers/forgotPassController');
const router = express.Router();

router.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});

router.post('/forgot-password', sendResetPasswordEmail);

module.exports = router;