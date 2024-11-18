const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();
const { successNotification, errorNotification } = require("../utils/notification");

const loginController = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await prismaClient.user.findUnique({
      where: { email }
    });

    if (!user) {
      const error = new Error('User tidak ditemukan');
      error.status = 400;
      errorNotification(error.message);
      return next(error);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Password yang anda masukkan salah!');
      error.status = 400;
      errorNotification(error.message);
      return next(error);
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    successNotification(`Berhasil Login!\nSelamat datang ${user.name}.`);

    // res.json({ token });

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'devmpeloper' });

    res.redirect('/dashboard');

  } catch (error) {
    errorNotification('Terjadi kesalahan saat proses login.');
    next(error);
  }
};

module.exports = { loginController };