import { Config } from "./commands/config.command.js";
import crypto from 'crypto';
import { getDb } from "./db.js";
import { Collection } from "mongodb";
import * as dotenv from 'dotenv';
import { WebhooksHelper } from "square";

dotenv.config();

  // /**
  //  * @param {Config} config
  //  * @returns {Promise<Collection<Document>}
  //  */
  // const getWebhookEventsRepository = async (config) => {
  //   return getDb(config.mongo.collections.webhookEvents.name);
  // }


// The URL where event notifications are sent.
const NOTIFICATION_URL = 'https://eatly-api.onrender.com/webhook';

// The signature key defined for the subscription.
const SIGNATURE_KEY = '3gDlnzICzVO7cQ1RT9gGaw';

// isFromSquare generates a signature from the url and body and compares it to the Square signature header.
function isFromSquare(signature, body) {
  console.log("VALIDATING");
  return WebhooksHelper.isValidWebhookEventSignature(
      body,
      signature,
      SIGNATURE_KEY,
      NOTIFICATION_URL
    );
}

function requestHandler(request, response) {
  let body = '';
  request.setEncoding('utf8');

  request.on('data', function(chunk) {
    body += chunk;
  });

  request.on('end', function() {
    const signature = request.headers['x-square-hmacsha256-signature'];
    if (isFromSquare(signature, body)) {
      // Signature is valid. Return 200 OK.
      response.writeHead(200);
      console.info("Request body: " + body);
    } else {
      console.log("INVALID SIGNATURE")
      // Signature is invalid. Return 403 Forbidden.
      response.writeHead(403);
    }
    response.end();
  });
}

// // Start a simple server for local testing.
// // Different frameworks may provide the raw request body in other ways.
// // INSTRUCTIONS
// // 1. Run the server:
// //    node server.js
// // 2. Send the following request from a separate terminal:
// //    curl -vX POST localhost:8000 -d '{"hello":"world"}' -H "X-Square-HmacSha256-Signature: 2kRE5qRU2tR+tBGlDwMEw2avJ7QM4ikPYD/PJ3bd9Og="
// const server = http.createServer(requestHandler);
// server.listen(8000);



/**
 * @param {Request} req 
 * @param {Response} res 
 * @param {import("express").NextFunction} next 
 * @param {Config} config
 */
export const webhook = async (req, res, config) => {
  requestHandler(req, res);
  // const event = req.body;
  // const metrics = {};
  // metrics.eventType = event.type;
  // metrics.eventId = event.event_id;

  // const webhookSecret = config.square.webHookSecret;

  // // dedupe
  // const repository = await getWebhookEventsRepository(config);
  // const eventData = await repository.findOne({
  //   id: event.event_id,
  // });

  // // if(eventData !== null) {
  // //   console.log('Duplicate event detected:', eventId);
  // //   return res.status(200).end();
  // // }


  // const signature = req.headers['x-square-hmacsha256-signature'];
  // const url = '	https://eatly-api.onrender.com/webhook';

  // const isValidSignature = verifySignature(url, req.body.toString(), signature, webhookSecret);
  // if (!isValidSignature) {
  //   console.error('\n\nInvalid webhook signature\n\n');
  //   return res.status(200).end();
  // }
  
  // console.log("All good!")
  // res.status(200).end();


  // // Verify the webhook event signature
  // // const signature = req.headers['x-square-signature'];
  // // const isValidSignature = verifySignature(JSON.stringify(req.body), signature, webhookSecret);
  // // if (!isValidSignature) {
  // //   console.error('Invalid webhook signature');
  // //   return res.status(400).end();
  // // }

  // // Process the webhook event
  // // Add your custom logic here to handle the event

  // res.status(200).end();
}

// Helper function to verify the webhook signature
// function verifySignature(requestUrl, payload, signature, secret) {
//   console.log(requestUrl, payload, signature, secret, "requestUrl, payload, signature, secret")
//   return WebhooksHelper.isValidWebhookEventSignature(
//     payload,
//     signature,
//     secret,
//     requestUrl
//   );
// }
