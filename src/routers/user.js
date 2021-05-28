const express = require('express');
const router = new express.Router();

const {redirectToHome, redirectToLogin} = require('../middleware/auth');
const {logout, loginTemplate, signupTemplate, login, signup} = require('../controller/user');

router.get('/logout', redirectToLogin, logout);

router.get('/login', redirectToHome, loginTemplate);

router.get('/signup', redirectToHome, signupTemplate);

router.post('/login', redirectToHome, login);

router.post('/signup', redirectToHome, signup);

module.exports = router;
