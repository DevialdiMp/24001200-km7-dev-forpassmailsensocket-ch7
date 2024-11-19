const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('@prisma/client').PrismaClient;
const prismaClient = new prisma();
const Sentry = require('@sentry/node');
const { sendEmail } = require('../utils/nodemailer');
const { successNotification, errorNotification } = require('../utils/notification');

const resetPassword = async (req, res, next) => {

  const { token, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    const error = new Error('Password dan konfirmasi password tidak sama.');
    error.status = 400;

    Sentry.captureException(error);

    errorNotification('Password dan konfirmasi password tidak sama.\nSilahkan mengisi ulang password anda!.');
    return res.render('reset-password', {
      token,
      errorMessage: 'Password dan konfirmasi password tidak sama.\nSilahkan mengisi ulang password anda!.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(password, 10);

    await prismaClient.user.update({
      where: { email: decoded.email },
      data: { password: hashedPassword },
    });

    await sendEmail(
      decoded.email,
      'Password Anda Telah Berhasil Diubah',
      `Password Anda telah berhasil diubah. Silahkan login dengan password baru menggunakan tautan berikut: ${process.env.BASE_URL}/login
      Jika ada permasalahan lebih lanjut mengenai username, email dan password Anda,\nSilahkan hubungi:\nDevialdi Maisa Putra | ${process.env.EMAIL_USER}`
    );

    successNotification('Password berhasil direset atau diubah. Silahkan login atau cek email anda untuk info lebih lanjut.');
    return res.render('password-changed');

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      error.message = 'Token expired atau tautan expired silahkan gunakan tautan baru.';
      error.status = 400;
    }
    Sentry.captureException(error);
    errorNotification('Token expired atau tautan expired silahkan gunakan tautan baru.');
    return next(error);
  }
};

module.exports = { resetPassword };