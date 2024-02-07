const express = require('express');
const { authController } = require('../controllers');
const {loginAuth} = require('../middlewares/auth');

const router = express.Router();

router.post('/signup', authController.signUpUser);
router.post('/login', authController.loginUser);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updatePassword',loginAuth,authController.updateMyPassword);


module.exports = router;