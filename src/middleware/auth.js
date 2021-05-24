const User = require('../model/user');

const redirectToLogin = async (req, res, next) => {
  if (req.session.isUserAuth) {
    // const user = await User.findOne({where: {id: req.session.userId}});

    // if (user)
    return next();
    // res.redirect('/login');
  }
  res.redirect('/login');
};

const redirectToHome = async (req, res, next) => {
  if (!req.session.isUserAuth) {
    // const user = await User.findOne({where: {id: req.session.userId}});
    // if (!user)
    return next();
  }

  res.redirect('/');
};

module.exports = {
  redirectToLogin,
  redirectToHome,
};
