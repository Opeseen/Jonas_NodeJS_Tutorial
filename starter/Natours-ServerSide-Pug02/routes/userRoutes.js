const express = require('express');
const { authController, userController } = require('../controllers');
const {loginAuth,userRoleAuth} = require('../middlewares/auth');

const router = express.Router();

router.post('/signup',authController.signUpUser);
router.post('/login', authController.loginUser);
router.get('/logout',authController.logoutUser)
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(loginAuth); // This middleware protect all route after above.


router.get('/me',userController.getMe,userController.getUser)
router.patch('/updatePassword',authController.updateMyPassword);
router.patch('/updateCurrentUserData',userController.updateCurrentUserData);
router.delete('/deleteMyUserData',userController.deleteMyUserData);


router.use(userRoleAuth('admin')); // This middleware restrict the below function to the admin.

router.delete('/deleteUser',userController.deleteUser);

router
  .route('/')
  .get(userController.getAllUsers);
  

router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser);

module.exports = router;