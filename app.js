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

const app = express();


const LocalEnv = process.env.NODE_ENV === 'dev';
if (LocalEnv) {
  dotenv.config({ path: '.env' });
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
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

routes(app);

try {
  app.listen(config.port, async() => {
    await new FirebaseClient(config).initFirebaseAdmin();
    await dbInit();
    logger.log(`EatlyAPI started on port ${config.port} `);
  });
} catch(error) {
  logger.error('unable to start app : ', error);
}
