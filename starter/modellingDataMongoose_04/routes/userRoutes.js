const express = require('express');
const { authController, userController } = require('../controllers');
const {loginAuth} = require('../middlewares/auth');

const router = express.Router();

router.get('/',userController.getAllUsers)

router.post('/signup', authController.signUpUser);
router.post('/login', authController.loginUser);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updatePassword',loginAuth,authController.updateMyPassword);
router.patch('/updateCurrentUserData',loginAuth,userController.updateCurrentUserData);
router.delete('/deleteMyUserData',loginAuth,userController.deleteMyUserData);




module.exports = router;