const { tourService } =  require('../services');

const getAllTours = async (req, res) => {
  try {
    const tours = await tourService.getAllTours();
    
    res.status(200).json({
      status: 'Success',
      results: tours.length,
      data: {tours}
    });

  } catch (error) {
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

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour
};
