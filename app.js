'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./app/config');
const logger = require('turbo-logger').createStream({});
const dotenv = require('dotenv');
const db = require('./app/db');

const LocalEnv = process.env.NODE_ENV === 'dev';
if (LocalEnv) {
  dotenv.config({ path: '.env' });
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.get('*', (req, res) => {
    return res.send({
        status: 200,
        message: 'Healthy'
    })
})

try {
  app.listen(config.port, async() => {
    await db();
    logger.log(`EatlyAPI started on port ${config.port} `);
  });
} catch(error) {
  logger.error('unable to start app : ', error);
}
