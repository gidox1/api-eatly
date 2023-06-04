import logger from "../logger.js";
import amqp from 'amqplib/callback_api.js';
import * as dotenv from 'dotenv';
import config from "../../config.js";
dotenv.config();

const connectionUrl = config.rabbit.url || null;

export const getConnectionChannel = () => {
  return new Promise((resolve, reject) => {
    return amqp.connect(connectionUrl, async (erorr, conn) => {
      if(erorr) {
        logger.error('failed to connect to rabbit', JSON.stringify(erorr));
        return reject('rabbit unable to connect...');
      }
      resolve(conn.createChannel());
    });
  });
}
