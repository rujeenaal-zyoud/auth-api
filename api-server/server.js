'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const multParse = multer();
// Esoteric Resources
const errorHandler = require('./src/error-handlers/500.js');
const notFound = require('./src/error-handlers/404.js');
const authRoutes = require('./src/routes/routes.js');
const v2Routes = require('./src/routes/v2');
const v1Routes = require('./src/routes/v1');
const logger = require('./src/middleware/logger');

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));
app.use(multParse.none());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
 app.use(authRoutes);

 app.use('/api/v1', v1Routes);
 app.use('/api/v2', v2Routes);

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: PORT => {
    app.listen(PORT, () => {
      console.log(`Server Up on ${PORT}`);
    });
  },
};