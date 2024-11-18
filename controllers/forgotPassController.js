const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();
const jwt = require('jsonwebtoken');
const Sentry = require('@sentry/node');
const { sendEmail } = require('../utils/nodemailer');
const { successNotification, errorNotification } = require("../utils/notification");

const sendResetPasswordEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await prismaClient.user.findUnique({ where: { email } });
    if (!user) {
      const error = new Error('Not Found! Email atau halaman tidak ditemukan.');
      error.status = 404;
      errorNotification(error.message);
      return next(error);
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const resetLink = `${process.env.BASE_URL}/security/v2/reset-password?token=${token}`;

    await sendEmail(
      email,
      'Reset Password Anda',
      `Klik tautan berikut untuk mereset atau merubah password akun anda: ${resetLink}\nTautan tersebut hanya berlaku selama 15 Menit.`
    );

    successNotification(`Email reset password telah dikirim ke ${email}`);
    return res.status(200).redirect('/login');

  } catch (error) {
    Sentry.captureException(error);
    errorNotification('Terjadi kesalahan saat mengirim email reset password.');
    return next(error);
  }
};

module.exports = { sendResetPasswordEmail };