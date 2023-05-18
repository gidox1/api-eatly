
const logger = require('turbo-logger').createStream({});
const firebase = require('firebase-admin');
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase-admin/auth');


class FirebaseClient {
  constructor(config) {
    this.config = config;
  }
  initFirebaseAdmin() {
    try {
      if (!firebase.apps.length) {
        const admin = firebase.initializeApp({
          credential: firebase.credential.cert(this.config.firebaseAdminConfig),
        });
        return admin;
      }
      return firebase.app();
    } catch(error) {
      logger.error('Error occured during Firebase admin initialization', error);
      throw error;
    }
  }

  async createUser(data) {
    try {
      return getAuth().createUser({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
      });
    } catch (error) {
      logger.error('unable to create user', error);
      throw error;
    }
  }

  async initFirebaseApp() {
    try {
      const app = initializeApp(this.config.firebaseAppConfig);
      return getAuth(app);
    } catch (error) {
      logger.error('Error occured during Firebase web initialization', error);
    }
  };
}

module.exports = FirebaseClient;