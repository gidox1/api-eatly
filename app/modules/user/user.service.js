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
    if(data.restaurantName === undefined && data.role === roles.merchant) {
      return TrueMyth.Result.err('Restaurant name is required for user with merchant role');
    }
  
    try {
      const existingUser = await this.repository.findOne({
        email: data.email
      });
  
      if(existingUser) {
        this.logger.error('user already exist');
        return TrueMyth.Result.err('user already exist');
      }

      const payload = buildUserData(data);
      const insertOperation = await this.repository.insertOne(payload);
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
        await this.restaurantRepository.insertOne({
          name: data.restaurantName,
          merchantId: user._id,
        });
      }

      return TrueMyth.Result.ok({
        name: user.name,
        email: user.email,
        token: undefined,
        id: user._id.toHexString(),
      });
    } catch(error) {
      this.logger.error('User creation error: ', error);
      return TrueMyth.Result.err('An error occured while creating user');
    }
  }
}
