'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import config from './app/config.js';
import logger from './app/lib/logger.js';
import * as dotenv from 'dotenv';
import { dbInit } from './app/db.js';
import routes from './app/routes/index.js';
import FirebaseClient from './app/lib/firebase.js';
import fileupload from "express-fileupload";
import cors from 'cors';
import { webhook } from './app/webhook.js';
import handleConsumerCreatedConsumer from './app/lib/mq/consumers/createCustomer.js';
import handleCustomerUpdated from './app/lib/mq/consumers/updateCustomer.js';

const LocalEnv = process.env.NODE_ENV === 'dev';
if (LocalEnv) {
  dotenv.config({ path: '.env' });
}

const app = express();

app.use(cors())

app.post('/webhook', (req, res, next) => webhook(req, res, config));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(fileupload({
  createParentPath: true,
  tempFileDir: '/tmp/',
    limits: {
      fileSize: 500000 //500kb
  },
  abortOnLimit: true,
  useTempFiles: true,
}));


app.get('/', (req, res, next) => {
  return res.send({
    status: 'Eatly service is up and running',
    code: 200
  });
})


// load routes
routes(app);

try {
  app.listen(config.port, async() => {
    await new FirebaseClient(config).initFirebaseAdmin();
    await dbInit();

    // start consumers
    await handleConsumerCreatedConsumer.start();
    await handleCustomerUpdated.start();
    logger.log(`EatlyAPI started on port ${config.port} `);
  });
} catch(error) {
  logger.error('unable to start app : ', error);
}
