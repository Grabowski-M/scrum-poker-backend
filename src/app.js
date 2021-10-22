module.exports = () => {
  const express = require('express');
  const cors = require('cors');
  const helmet = require('helmet');
  const morgan = require('morgan');
  const DataBaseApi = require('./services/DatabaseApi')(process.env.DATABASE_API_URL);

  const roomRoutes = require('./room/roomRoutes')(DataBaseApi);

  const app = express();

  app.use(helmet());
  // app.use(bodyParser.json());
  app.use(express.json());
  app.use(cors());
  app.use(morgan('combined'));

  app.use('/api', roomRoutes);

  return app;
};
