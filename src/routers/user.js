const express = require('express');
const router = new express.Router();
const bcrypt = require('bcryptjs');
const User = require('../model/user');
const {redirectToHome, redirectToLogin} = require('../middleware/auth');

const setSession = (req, user) => {
  req.session.userId = user.id;
  req.session.isUserAuth = true;
};

router.get('/logout', redirectToLogin, (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

router.get('/login', redirectToHome, (req, res) => {
  res.render('login', {
    title: 'Login',
    isAuth: req.session.isUserLoggedIn,
  });
});

router.get('/signup', redirectToHome, (req, res) => {
  res.render('signup', {
    title: 'Sign Up',
    isAuth: req.session.isUserLoggedIn,
  });
});

router.post('/login', redirectToHome, async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({where: {email}});
    if (!user) throw new Error('Invalid Email or Password!');

    const isMatch = await bcrypt.compare(password, user.dataValues.password);
    if (!isMatch) throw new Error('Invalid Email or Password!');

    setSession(req, user.dataValues);
    req.user = user;
    res.redirect('/');
  } catch (err) {
    return res.status(400).render('login', {
      title: 'Login',
      isAuth: req.session.isUserLoggedIn,
      errorMsg: 'Invalid Email or Password',
    });
  }
});

router.post('/signup', redirectToHome, async (req, res) => {
  try {
    const {userName, email, password} = await req.body;

    if (!email || !password) throw new Error('Email OR Password cannot Be empty!');
    const hashPassword = await bcrypt.hash(password, 8);

    const user = await User.create({name: userName, email, password: hashPassword});

    setSession(req, user.dataValues);
    req.user = user;
    res.redirect('/');
  } catch (err) {
    return res.status(400).render('signup', {
      title: 'Sign Up',
      isAuth: req.session.isUserLoggedIn,
      errorMsg:
        err.toString() === 'SequelizeUniqueConstraintError: Validation error'
          ? 'Email Already Taken!'
          : err.toString(),
    });
  }
});

module.exports = router;
