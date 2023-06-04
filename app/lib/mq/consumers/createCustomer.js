import config from '../../../config.js';
import logger from '../../logger.js';
import amqp from 'amqplib/callback_api.js';
import { consumer } from '../consumer.js';
import * as dotenv from 'dotenv';
import client from '../../square.js';
// import UserService from '../../../modules/user/user.service.js';
// import { getDb } from '../../../db.js';
// import { isErr, toJSON } from "true-myth/result";

dotenv.config();

const connectionUrl = config.rabbit.url || null;

class HandleCustomerCreated {
  async start() {
    const metrics = {};
    metrics.consumer = 'HandleCustomerCreated';
    logger.log(`started consumer`);
    try {
      await amqp.connect(connectionUrl, async (err, conn) => {
        logger.log('...successfully connected to amqp...');
        const channel = await conn.createChannel();
        let resp = await consumer(config.rabbit.queue.userCreation, channel);
        resp = JSON.parse(resp);

        const payload = JSON.parse(resp.message);
        // const userId = payload.userId;
        delete payload.userId;
        await client.customersApi.createCustomer(payload);
        // const userRepository = await getDb(config.mongo.collections.user.name);
        // const customerId = call.result.customer.id;
        // metrics.customerId = customerId;

        // // const updateUserResponse = await new UserService(logger, config, userRepository, {}, {}).update({
        // //   paymentProviderCustomerId: customerId,
        // // }, userId);

        // // if (isErr(updateUserResponse)) {
        // //   throw new Error('failed to update user')
        // // }
        metrics.isSuccess = true; 
      });
    } catch(E) {
      console.log('Consumer connection Error', E);
    }
  }
}

export default new HandleCustomerCreated();
