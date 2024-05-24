const express = require('express');
const {viewsController} = require('../controllers');
const {loginAuth} = require('../middlewares/auth');
const {IsloginAuth} = require('../middlewares/auth');

const router = express.Router();

// ROUTES FOR THE BASE TEMPLATE

router.get('/', IsloginAuth, viewsController.getOverview);
router.get('/tour/:slug',IsloginAuth, viewsController.getTour);
router.get('/login', IsloginAuth, viewsController.getLoginForm);
router.get('/me',loginAuth, viewsController.getAccount);

module.exports = router;