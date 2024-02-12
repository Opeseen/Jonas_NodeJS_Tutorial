const express = require('express');
const { tourController } = require('../controllers');
const {loginAuth, userRoleAuth} = require('../middlewares/auth');

const router = express.Router();

router.route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats')
  .get(tourController.getTourStats)

router.route('/monthly-plan/:year')
  .get(tourController.getMonthlyPlan)

router
  .route('/')
  .get(loginAuth, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(loginAuth, userRoleAuth('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;
