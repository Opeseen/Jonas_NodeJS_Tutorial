const express = require('express');
const { authController, userController } = require('../controllers');
const {loginAuth,userRoleAuth} = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(authController.signUpUser);

router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser);

router.post('/login', authController.loginUser);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updatePassword',loginAuth,authController.updateMyPassword);
router.patch('/updateCurrentUserData',loginAuth,userController.updateCurrentUserData);
router.delete('/deleteMyUserData',loginAuth,userController.deleteMyUserData);
router.delete('/deleteUser',loginAuth,userRoleAuth('admin'),userController.deleteUser);


module.exports = router;