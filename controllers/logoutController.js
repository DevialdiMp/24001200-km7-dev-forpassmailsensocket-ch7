const { successNotification, errorNotification } = require('../utils/notification');

const logoutController = (req, res) => {
  res.clearCookie('token');

  successNotification('Berhasil logout!');
  res.redirect('/');
};

module.exports = { logoutController };