const express = require('express');
const {viewsController} = require('../controllers');
const {IsloginAuth} = require('../middlewares/auth');

const router = express.Router();

// ROUTES FOR THE BASE TEMPLATE
router.use(IsloginAuth);

router.get('/',viewsController.getOverview);
router.get('/tour/:slug',viewsController.getTour);
router.get('/login', viewsController.getLoginForm);

module.exports = router;