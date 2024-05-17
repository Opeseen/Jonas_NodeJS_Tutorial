const express = require('express');
const { tourController } = require('../controllers');
const {loginAuth, userRoleAuth} = require('../middlewares/auth');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter); // NESTED ROUTES

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/tour-stats')
  .get(tourController.getTourStats)

router
  .route('/monthly-plan/:year')
  .get(loginAuth, userRoleAuth('admin', 'lead-guide', 'guide'),tourController.getMonthlyPlan)

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getTourWithin);

router
  .route('/distances/:latlng/unit/:unit')
  .get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(loginAuth, userRoleAuth('admin', 'lead-guide'),tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(loginAuth, userRoleAuth('admin', 'lead-guide'),tourController.updateTour)
  .delete(loginAuth, userRoleAuth('admin', 'lead-guide'), tourController.deleteTour);


module.exports = router;
