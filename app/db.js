const { Db, Collection, MongoClient } = require('mongodb');
const config = require('./config');
const schemas = require('./schema');
const mongodb = require('mongodb').MongoClient;

const logger = require('turbo-logger').createStream({});

/**
 * @returns {Db}
 */
const dbInit =  async() => {
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
  return await mongodb.connect(
    connectionString,
    { useNewUrlParser: true, useUnifiedTopology: true },
  );
}

/**
 * Returns a collection of document
 * @param {Collection<Document>} collectionName 
 * @returns 
 */
const getDb = async(collectionName) => {
  const connection = (await $getConnection()).db();
  return connection.collection(collectionName);
}

module.exports = {
  getDb,
  dbInit
};