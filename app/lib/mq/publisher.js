import logger from "../logger.js";

export const publisher = async (queueName, data, channel) => {
  // create queue if queue doesnt exist
  channel.assertQueue(queueName,  {
    durable: true
  });

  //send message to queue
  logger.log(`sending message to queue with name: ${queueName} and data: ${JSON.stringify(data)}\n\n`);
  try {
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    logger.log(`successfully published message to queue: ${queueName} response: ${JSON.stringify(data)}\n\n`);
    return;
  } catch (E) {
    logger.log(`An error occured while attempting to publish to queue: ${queueName}: Error: ${E}\n\n`);
  }
}
