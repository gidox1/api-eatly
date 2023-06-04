import { Config } from "./commands/config.command.js";
import { getDb } from "./db.js";
import { Collection } from "mongodb";
import * as dotenv from 'dotenv';
import { WebhooksHelper } from "square";
import UserService from "./modules/user/user.service.js";
import logger from "./lib/logger.js";
import { isErr } from "true-myth/result";

dotenv.config();

// The URL where event notifications are sent.
const NOTIFICATION_URL = 'https://eatly-api.onrender.com/webhook';
// The signature key defined for the subscription.
const SIGNATURE_KEY = process.env.WEBHOOK_SECRET;

// isFromSquare generates a signature from the url and body and compares it to the Square signature header.
function isFromSquare(signature, body) {
  return WebhooksHelper.isValidWebhookEventSignature(
      body,
      signature,
      SIGNATURE_KEY,
      NOTIFICATION_URL
    );
}

/**
 * @param {Config} config
 * @returns {Promise<Collection<Document>}
 */
const getWebhookEventsRepository = async (config) => {
  return getDb(config.mongo.collections.webhookEvents.name);
}

/**
 * @param {Request} req 
 * @param {Response} res 
 * @param {import("express").NextFunction} next 
 * @param {Config} config
 */
export const webhook = async (request, response, config) => {
  let body = '';
  request.setEncoding('utf8');

  request.on('data', function(chunk) {
    body += chunk;
  });

  request.on('end', async function() {
    const signature = request.headers['x-square-hmacsha256-signature'];
    if (isFromSquare(signature, body)) {
      await HandleEvents(body, config);
      response.writeHead(200);
    } else {
      console.log("INVALID SIGNATURE")
      // Signature is invalid. Return 403 Forbidden.
      response.writeHead(403);
    }
    response.end();
  });
}


const HandleEvents = async (event, config) => {
  event = JSON.parse(event);
  // dedupe
  const webhookEventRepository = await getWebhookEventsRepository(config);
  const eventData = await webhookEventRepository.findOne({
    id: event.event_id,
  });

  if(eventData !== null) {
    logger.error('Duplicate event detected:', {
      eventId: event.event_id,
    });
    return;
  }

  switch(event.type) {
    case 'customer.created':
      const metrics = {};
      metrics.eventType = 'customer.created';
      const userRepository = await getDb(config.mongo.collections.user.name);
      const user = await userRepository.findOne({ email: event.data.object.customer.email_address });
      const customerId = event.data.id;
      metrics.customerId = customerId;
      metrics.userId = user._id.toHexString();

      const updateUserResponse = await new UserService(logger, config, userRepository, {}, {}).update({
        paymentProviderCustomerId: customerId,
      }, user._id.toHexString());

      if (isErr(updateUserResponse)) {
        throw new Error('failed to update user')
      }

      await webhookEventRepository.insertOne({
        type: event.type,
        id: event.event_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      logger.log('successfully handled customer created event', metrics);
      break;
    case 'customer.updated':
      logger.log('Successfully receievd customer updated webhook request!')
      break;
    default:
      console.log('default event!');
  }
}
