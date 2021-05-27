const User = require('../model/user');

const redirectToLogin = async (req, res, next) => {
  if (req.session) {
    const userId = req.session.userId;
    if (!userId) {
      res.redirect('/login');
      return req.session.destroy();
    }
    const user = await User.findOne({where: {id: userId}});
    if (!user) {
      res.redirect('/login');
      return req.session.destroy();
    }

    if (req.session.isUserAuth) {
      return next();
    }
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
