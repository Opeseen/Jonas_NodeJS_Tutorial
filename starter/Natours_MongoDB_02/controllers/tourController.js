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

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};

module.exports = {
  checkBody,
  checkID,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour
};
