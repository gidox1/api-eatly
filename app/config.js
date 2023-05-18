const dotenv = require('dotenv');
dotenv.config();

const config = {
  port: process.env.PORT,
  mongo: {
    connectionString: process.env.MONGO_CONNECTION_STRING || 'mongodb://admin:password@localhost:27017/',
    collections: {
      user: {
        name: 'user'
      },
      restaurant: {
        name: 'restaurant'
      },
      branch: {
        name: 'branch'
      },
    }
  },
  appName: 'eatly'
}

module.exports = config;