import logger from "../logger.js";

export const consumer = async (queueName, channel) => {
  channel.assertQueue(queueName,  {
    durable: true
  });
  return getMessage(queueName, channel);
}

const getMessage = (queueName, channel) => {
  return new Promise((resolve, reject) => {
    channel.consume(queueName, (message, err) => {
      if(err) {
        logger.log('an error occured while consuming from channel', err);
        return;
      }

      if (message) {
        const content = message.content.toString();
        logger.log(`successfully consumed from queue with name ${queueName} -- message:: ${JSON.stringify(message)}`);
        channel.ack(message);
        resolve(content);
      } else {
        reject(new Error('No message received'));
      }
    });
  });
}
