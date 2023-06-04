import config from '../../../config.js';
import logger from '../../logger.js';
import amqp from 'amqplib/callback_api.js';
import { consumer } from '../consumer.js';
import * as dotenv from 'dotenv';
import client from '../../square.js';

dotenv.config();

const connectionUrl = config.rabbit.url || null;

class HandleCustomerUpdated {
  async start() {
    const metrics = {};
    metrics.consumer = 'HandleCustomerUpdated';
    logger.log(`started consumer`);
    try {
      await amqp.connect(connectionUrl, async (err, conn) => {
        logger.log('...successfully connected to amqp...');
        const channel = await conn.createChannel();
        let resp = await consumer(config.rabbit.queue.userUpdated, channel);
        resp = JSON.parse(resp);

        const payload = JSON.parse(resp.message);
        metrics.customerId = payload.customerId;
        metrics.userId = payload.userId;
        delete payload.userId;
        await client.customersApi.updateCustomer(payload.customerId, {
          phoneNumber: payload.phoneNumber
        });
        metrics.isSuccess = true; 
        logger.log('User update consumer processed successfully', metrics);
      });
    } catch(E) {
      console.log('Consumer connection Error', E);
    }
  }
}

export default new HandleCustomerUpdated();
