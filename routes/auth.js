const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');


router.post('/signup', authController.signup);//route pour signup   
router.post('/login', authController.login);//route login

module.exports = router;