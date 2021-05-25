const redirectToLogin = async (req, res, next) => {
  if (req.session.isUserAuth) {
    return next();
  }
  res.redirect('/login');
};

const redirectToHome = async (req, res, next) => {
  if (!req.session.isUserAuth) {
    return next();
  }

  res.redirect('/');
};

module.exports = {
  redirectToLogin,
  redirectToHome,
};
