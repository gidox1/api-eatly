import * as dotenv from 'dotenv';
dotenv.config();

export default {
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
      product: {
        name: 'product'
      },
      order: {
        name: 'order'
      },
      payment: {
        name: 'payment'
      },
      webhookEvents: {
        name: 'webhookEvents'
      },
    }
  },
  firebaseAdminConfig: {
    type: process.env.FIREBASE_PROJECT_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PROJECT_PRIVATE_KEY_ID,
    private_key: JSON.parse(`"${process.env.FIREBASE_PROJECT_PRIVATE_KEY}"`),
    client_email: process.env.FIREBASE_PROJECT_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_PROJECT_CLIENT_ID,
    auth_uri: process.env.FIREBASE_PROJECT_AUTH_URI,
    token_uri: process.env.FIREBASE_PROJECT_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_PROJECT_AUTH_PROVIDER_x509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_PROJECT_CLIENT_x509_CERT_URL,
  },
  firebaseAppConfig: {
    apiKey: process.env.FIREBASE_APP_API_KEY,
    authDomain: process.env.FIREBASE_APP_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_APP_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_APP_MEASUREMENT_ID,
  },
  appName: 'eatly',
  pagination: {
    page: process.env.PAGE || 1,
    pageSize: process.env.PAGE_SIZE || 20,
    orderDirection: process.env.ORDER_DIRECTION || -1,
    orderBy: process.env.ORDER_BY || 'createdAt',
  },
  cloudinary: {
    cloudinaryName: process.env.CLOUDINARY_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  square: {
    locationId: process.env.SQUARE_LOCATION_ID,
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    webHookSecret: process.env.WEBHOOK_SECRET,
  },
  rabbit: {
    url: process.env.RABBIT_URL,
    queue: {
      userCreation: 'userCreation',
      userUpdated: 'userUpdated',
    },
  },
}
