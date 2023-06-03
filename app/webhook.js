import { Config } from "./commands/config.command.js";
import crypto from 'crypto';
import { getDb } from "./db.js";
import { Collection } from "mongodb";
import * as dotenv from 'dotenv';
dotenv.config();

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
export const webhook = async (req, res, config) => {
  const event = req.body;
  const metrics = {};
  metrics.eventType = event.type;
  metrics.eventId = event.event_id;

  const webhookSecret = config.square.webHookSecret;

  // dedupe
  const repository = await getWebhookEventsRepository(config);
  const eventData = await repository.findOne({
    id: event.event_id,
  });

  // if(eventData !== null) {
  //   console.log('Duplicate event detected:', eventId);
  //   return res.status(200).end();
  // }

  console.log(eventData, "eventDataeventData");
  const signature = req.headers['x-square-signature'];
  const isValidSignature = verifySignature(req.rawBody, signature, webhookSecret);
  if (!isValidSignature) {
    console.error('\n\nInvalid webhook signature\n\n');
    res.status(200).end();
  }

  res.status(200).end();


  // Verify the webhook event signature
  // const signature = req.headers['x-square-signature'];
  // const isValidSignature = verifySignature(JSON.stringify(req.body), signature, webhookSecret);
  // if (!isValidSignature) {
  //   console.error('Invalid webhook signature');
  //   return res.status(400).end();
  // }

  // Process the webhook event
  // Add your custom logic here to handle the event

  res.status(200).end();
}

// Helper function to verify the webhook signature
function verifySignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha1', secret)
    .update(payload)
    .digest('hex');
  return signature === expectedSignature;
}
