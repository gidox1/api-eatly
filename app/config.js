const dotenv = require('dotenv');
dotenv.config();

const config = {
  port: process.env.PORT,
  mongo: {
    connectionString: process.env.MONGO_CONNECTION_STRING || 'mongodb://admin:password@localhost:27017/'
  },
  appName: 'eatly'
}

module.exports = config;