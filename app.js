'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./app/config');
const logger = require('turbo-logger').createStream({});
const dotenv = require('dotenv');
const { dbInit } = require('./app/db');
const routes = require('./app/routes');

const LocalEnv = process.env.NODE_ENV === 'dev';
if (LocalEnv) {
  dotenv.config({ path: '.env' });
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

routes(app);


try {
  app.listen(config.port, async() => {
    await dbInit();
    logger.log(`EatlyAPI started on port ${config.port} `);
  });
} catch(error) {
  logger.error('unable to start app : ', error);
}
