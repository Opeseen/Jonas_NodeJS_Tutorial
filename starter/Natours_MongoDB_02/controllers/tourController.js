const { tourService } =  require('../services');

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,-price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const getAllTours = async (req, res) => {
  try {
    const tours = await tourService.getAllTours(req.query);    
    res.status(200).json({
      status: 'Success',
      results: tours.length,
      data: {tours}
    });

  } catch (error) {
    console.log(error)
    res.status(404).json({
      status: 'Failed',
      message: error
    });    
  }
};

const getTour = async(req, res) => {
  const id = req.params.id;
  try {
    const tour = await tourService.getTour(id);
    res.status(200).json({
      status: 'Success',
      data: {tour}
    });

  } catch (error) {
    res.status(404).json({
      status: 'Failed',
      message: error
    });
  }
};

const createTour = async(req, res) => {
  try {
    const newTour = await tourService.createTour(req.body);
    res.status(201).json({
      status: 'Success',
      data: {tour: newTour}
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error
    });
  }
};

const updateTour = async(req, res) => {
  const id = req.params.id;
  try {
    const updatedTour = await tourService.updateTour(id,req.body);
    res.status(200).json({
      status: 'Success',
      updatedTour
    });
  } catch (error) {
    res.status(404).json({
      status: 'Failed',
      message: error
    });
  }
};

const deleteTour = async(req, res) => {
  const id = req.params.id;
  try {
    await tourService.deleteTour(id);
    res.status(204).json({
      status: 'Success',
    });
  } catch (error) {
    res.status(404).json({
      status: 'Failed',
      message: error
    });
  }
};

const getTourStats = async(req, res) => {
  try {
    const stats = await tourService.getTourStats();
    res.status(200).json({
      status: 'Success',
      stats
    });
  } catch (error) {
    res.status(404).json({
      status: 'Failed',
      message: error
    });
  }
}

const getMonthlyPlan = async(req, res) => {
  year = req.params.year * 1;
  try {
    const plan = await tourService.getMonthlyPlan(year);
    res.status(200).json({
      status: 'Success',
      results: plan.length,
      plan
    });
  } catch (error) {
    res.status(404).json({
      status: 'Failed',
      message: error
    });
  }
}

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan
};
