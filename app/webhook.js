import { Config } from "./commands/config.command";
import crypto from 'crypto';

/**
 * @param {Request} req 
 * @param {Response} res 
 * @param {import("express").NextFunction} next 
 * @param {Config} config
 */
export const webhook = async (req, res, config) => {
  const webhookSecret = config.square.webHookSecret;

  // Verify the webhook event signature
  const signature = req.headers['x-square-signature'];
  const isValidSignature = verifySignature(req.rawBody, signature, webhookSecret);
  if (!isValidSignature) {
    console.error('Invalid webhook signature');
    return res.status(400).end();
  }

  // Process the webhook event
  const event = req.body;
  // Add your custom logic here to handle the event
  console.log('Received event:', event);

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
