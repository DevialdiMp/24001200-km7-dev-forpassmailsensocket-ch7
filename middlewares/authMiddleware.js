const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log('Token:', token);

  if (!token) {
    return res.redirect('/login');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).render('error', { message: 'Token tidak valid' });
    }

    req.user = user;
    next();
  });
};

module.exports = { verifyToken };