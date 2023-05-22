import { Db, Collection, MongoClient } from 'mongodb';
import config from './config.js';
import schemas from './schema.js'
import mongodb from 'mongodb';
import logger from './lib/logger.js';

/**
 * @returns {Db}
 */
export const dbInit =  async() => {
  try {
    const client = await $getConnection();
    const connection = client.db();
    const collections = (await connection.collections()).map((v) => v.collectionName);

    for(let schema of schemas) {
      if (collections && !collections.includes(schema.id)) {
        await connection.createCollection(schema.id, {
          validator: {
            $jsonSchema: {
              bsonType: "object",
              required: schema.required,
              properties: schema.properties,
            },
          }
        });
      } else {
        await connection.command({ 
          collMod: schema.id,
          validator: {
            $jsonSchema: {
              bsonType: "object",
              required: schema.required,
              properties: schema.properties,
            },
          },
        });
      }
    }

    logger.log('successfully connected to database.')
    return connection;
  } catch(error) {
    logger.error('unable to connect to database: ', error)
    throw error;
  }
}

/**
 * 
 * @returns {Promise<MongoClient>}
 */
const $getConnection = async () => {
  const connectionString = `${config.mongo.connectionString}`;
  return await mongodb.MongoClient.connect(
    connectionString,
    { useNewUrlParser: true, useUnifiedTopology: true },
  );
}

/**
 * Returns a collection of document
 * @param {Collection<Document>} collectionName 
 * @returns 
 */
export const getDb = async(collectionName) => {
  const connection = (await $getConnection()).db();
  return connection.collection(collectionName);
}
