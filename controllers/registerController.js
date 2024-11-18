const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();
const Sentry = require('@sentry/node');
const { successNotification, errorNotification } = require("../utils/notification");

const registerController = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const error = new Error(`Registrasi gagal\nEmail ${email} sudah terdaftar!`);
      error.status = 400;
      errorNotification(error.message);

      Sentry.captureException(error, {
        email,
        name,
        context: "Registrasi",
      });

      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prismaClient.user.create({
      data: { name, email, password: hashedPassword },
    });

    successNotification(`Pengguna ${name} berhasil mendaftar!`);
    res.redirect("/login");

  } catch (error) {
    Sentry.captureException(error);
    errorNotification('Terjadi kesalahan saat registrasi.');
    next(error);
  }
};

module.exports = { registerController };