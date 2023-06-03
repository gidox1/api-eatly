import { Config } from "./commands/config.command.js";
import crypto from 'crypto';
import { getDb } from "./db.js";
import { Collection } from "mongodb";
import * as dotenv from 'dotenv';
import { WebhooksHelper } from "square";

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


  const signature = req.headers['x-square-hmacsha256-signature'];
  const url = '	https://eatly-api.onrender.com/webhook';

  const isValidSignature = verifySignature(url, req.body.toString(), signature, webhookSecret);
  if (!isValidSignature) {
    console.error('\n\nInvalid webhook signature\n\n');
    return res.status(200).end();
  }
  
  console.log("All good!")
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
function verifySignature(requestUrl, payload, signature, secret) {
  console.log(requestUrl, payload, signature, secret, "requestUrl, payload, signature, secret")
  return WebhooksHelper.isValidWebhookEventSignature(
    payload,
    signature,
    secret,
    requestUrl
  );
}
