'use strict';

require('dotenv').config();
const server = require('./api-server/server');

// Start up DB Server
const mongoose = require('mongoose');

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose.connect(process.env.MONGODB_URI, options);


// Start the web server
require('./api-server/server').start(process.env.PORT);