import { Collection, ObjectId } from 'mongodb';
import * as TrueMyth from 'true-myth';
import FirebaseClient from '../../lib/firebase.js'
import { buildUserData, roles, userResponseMapper } from './user.helper.js';
import { UserMapper } from '../../commands/user.command.js';
import { publisher } from '../../lib/mq/publisher.js';
import { getConnectionChannel } from '../../lib/mq/index.js';

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
      metrics.userId = user._id.toHexString();

      // create user on firebase
      await this.firebaseClient.createUser({
        email: user.email,
        password: data.password,
        displayName: data.name,
        id: user._id.toHexString(),
      });
      metrics.firebaseUserCreated = true;

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

      // publish user created message
      // this can run synchronously
      const channel = await getConnectionChannel();
      publisher(this.config.rabbit.queue.userCreation, {
        test: true,
        message: JSON.stringify({
          userId: user._id.toHexString(),
          idempotencyKey: crypto.randomUUID(),
          givenName: user.name.split(" ")[0],
          familyName: user.name.split(" ")[1],
          emailAddress: user.email,
          phoneNumber: user.phoneNumber,
        })
      }, channel);

      return TrueMyth.Result.ok({
        name: user.name,
        email: user.email,
        token: undefined,
        id: user._id.toHexString(),
        restaurantId: restaurantId,
      });
    } catch(error) {
      if(metrics.userId && metrics.firebaseUserCreated) {
        await this.firebaseClient.deleteUser(data.email);
        await this.repository.deleteOne({ email: data.email });
      }
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

  /**
   * @param {String} id 
   * @returns {TrueMyth.Result<WithId<UserMapper>, any>} 
   */
  async getById(id) {
    if(!id) {
      return TrueMyth.Result.err(`userId is required`);
    }
    const metrics ={};
    metrics.id = id;
    try {
      const user = await this.repository.findOne({_id: new ObjectId(id)});
      if(user === null) {
        this.logger.error('user does not exist: ', metrics);
        return TrueMyth.Result.err(`user with id ${id.toString()} does not exist`);
      }
      return TrueMyth.Result.ok(userResponseMapper(user));
    } catch(error) {
      this.logger.error('User fetch error: ', error);
      return TrueMyth.Result.err('An error occured while getting user by Id');
    }
  }


  /**
   * @param {Object} data 
   * @returns {TrueMyth.Result<WithId<UserMapper>, any>} 
   */
  async update(data, userId) {
    const metrics ={data};
    try {
      const user = await this.repository.findOne({_id: new ObjectId(userId)});
      if(user === null) {
        this.logger.error('user does not exist: ', metrics);
        return TrueMyth.Result.err(`user with id ${id.toString()} does not exist`);
      }
      await this.repository.updateOne({_id: new ObjectId(userId) }, { 
        $set: { 
          ...data,
        }
      });
      const updated = await this.repository.findOne({_id: new ObjectId(userId)});
      return TrueMyth.Result.ok(userResponseMapper(updated));
    } catch(error) {
      this.logger.error('User fetch error: ', error);
      return TrueMyth.Result.err('An error occured while getting user by Id');
    }
  }
}
