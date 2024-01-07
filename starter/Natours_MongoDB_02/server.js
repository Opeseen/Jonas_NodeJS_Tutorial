require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('./config/logger');

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => logger.info("mongodb connected"))
  .catch((error) => logger.error(error));

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
