import { Collection } from 'mongodb';
import * as TrueMyth from 'true-myth';
import FirebaseClient from '../../lib/firebase.js'
import { buildUserData, roles } from './user.helper.js';

export default class UserService {

  /**
   * @param {logger} logger 
   * @param {*} config 
   * @param {Collection} repository 
   * @param {FirebaseClient} firebaseClient 
   * @param {Collection} restaurantRepository
   */
  constructor(logger, config, repository, firebaseClient, restaurantRepository){
    this.logger = logger;
    this.config = config;
    this.repository = repository;
    this.firebaseClient = firebaseClient;
    this.restaurantRepository = restaurantRepository;
  }

  /**
   * @param {Object} data 
   * @returns {TrueMyth.Result<any, string>}
   */
  async create(data) {
    const metrics = {...data};
    metrics.userExists = 'false';
    let restaurantId = undefined;
    metrics.restaurantId = restaurantId;

    if(data.restaurantName === undefined && data.role === roles.merchant) {
      return TrueMyth.Result.err('Restaurant name is required for user with merchant role');
    }
  
    try {
      const existingUser = await this.repository.findOne({
        email: data.email
      });
  
      if(existingUser) {
        metrics.userExists = 'true';
        this.logger.error('user already exist');
        return TrueMyth.Result.err('user already exist');
      }

      const payload = buildUserData(data);
      const insertOperation = await this.repository.insertOne({
        ...payload,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const user = await this.repository.findOne({_id: insertOperation.insertedId});

      // create user on firebase
      await this.firebaseClient.createUser({
        email: user.email,
        password: data.password,
        displayName: data.name,
        id: user._id.toHexString(),
      });

      if(data.role === roles.merchant) {
        // create restaurant if user is a merchant
        const existingRestaurant = await this.restaurantRepository.findOne({ name: data.restaurantName });
        if(existingRestaurant === null) {
          const insertOps = await this.restaurantRepository.insertOne({
            name: data.restaurantName,
            merchantId: user._id,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          restaurantId = insertOps.insertedId.toHexString();
          metrics.restaurantId = restaurantId;
        } else {
          await this.firebaseClient.deleteUser(data.email);
          await this.repository.deleteOne({ email: data.email });
          this.logger.error('restaurant already exist', {
            name: data.restaurantName,
            merchant: data.email,
          });
          return TrueMyth.Result.err('restaurant already exist');
        }
      }

      return TrueMyth.Result.ok({
        name: user.name,
        email: user.email,
        token: undefined,
        id: user._id.toHexString(),
        restaurantId: restaurantId,
      });
    } catch(error) {
      this.logger.error('User creation error: ', error);
      return TrueMyth.Result.err('An error occured while creating user');
    }
  }

    /**
   * @param {Object} data 
   * @returns {TrueMyth.Result<any, string>}
   */
    async login(data) {
      const metrics = {};
      metrics.email = data.email;

      try {
        const user = await this.repository.findOne({
          email: data.email
        });
    
        if(user === null) {
          this.logger.error('user does not exist', metrics);
          return TrueMyth.Result.err('user does not exist');
        }
        
        // login user on firebase
        const authResponse = await this.firebaseClient.login({
          email: data.email,
          password: data.password,
        });

        return TrueMyth.Result.ok({ 
          userId: user._id, 
          token: authResponse.user.stsTokenManager.accessToken 
        });
      } catch(error) {
        this.logger.error('User login error: ', error, metrics);
        if(error.code === 'auth/wrong-password') {
          return TrueMyth.Result.err('Invalid auth credentials');
        }
        return TrueMyth.Result.err('An error occured while authenticating user');
      }
    }
}
