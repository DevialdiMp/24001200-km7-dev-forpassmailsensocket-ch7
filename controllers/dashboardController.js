const dashboardController = (req, res) => {
  const user = req.user;

  if (!user) {
    return res.redirect('/login');
  }

  res.render('dashboard', { name: user.name, email: user.email });
};

module.exports = { dashboardController };