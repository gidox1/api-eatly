import logger from './logger.js';
import firebase from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { getAuth as adminAuth } from 'firebase-admin/auth';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';


export default class FirebaseClient {
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
      const createdUser = await adminAuth().createUser({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
      });
      // set eatlyUserId as custom claim
      await this.initFirebaseAdmin().auth().setCustomUserClaims(createdUser.uid, { eatlyUserId: data.id });
    } catch (error) {
      logger.error('unable to create user', error);
      throw error;
    }
  }

  async login(data) {
    const auth = await this.initFirebaseApp();
    return signInWithEmailAndPassword(auth, data.email, data.password);
  }

  async initFirebaseApp() {
    try {
      const app = await initializeApp(this.config.firebaseAppConfig);
      return getAuth(app);
    } catch (error) {
      logger.error('Error occured during Firebase web initialization', error);
    }
  };
}
