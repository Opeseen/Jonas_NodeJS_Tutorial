require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
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

const httpServer = http.createServer(app); 

const port = process.env.PORT || 3000;

const server = httpServer.listen(port, () => {
  logger.info(`Server is listening on port ${port}`);
});

const exitHandler = () => {
  if(server){
    server.close(() => {
      logger.info("Server Closed!");
      process.exit(1);
    });
  }else{
    process.exit(1);
  }
};

const unExpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};


process.on("uncaughtException", unExpectedErrorHandler);
process.on("unhandledRejection", unExpectedErrorHandler);
process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if(server){
    server.close();
  }
});
