const express = require('express');
const {viewsController} = require('../controllers');

const router = express.Router();

// ROUTES FOR THE BASE TEMPLATE
router.get('/',viewsController.getOverview);

router.get('/tour/:slug',viewsController.getTour);

module.exports = router;