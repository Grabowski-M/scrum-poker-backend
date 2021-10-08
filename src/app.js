module.exports = (db) => {
  const express = require('express');
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const helmet = require('helmet');
  const morgan = require('morgan');

  const roomRoutes = require('./routes/roomRoutes')(db);

  const app = express();

  app.use(helmet());
  // app.use(bodyParser.json());
  app.use(express.json());
  app.use(cors());
  app.use(morgan('combined'));

  app.use('/api', roomRoutes);

  return app;
};
