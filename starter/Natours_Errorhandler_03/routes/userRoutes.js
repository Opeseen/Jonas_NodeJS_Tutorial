const express = require('express');
const { authController } = require('../controllers');

const router = express.Router();

router.post('/signup', authController.signUpUser);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.forgotPassword);


module.exports = router;