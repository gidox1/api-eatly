import config from '../config.js';
import { getDb } from '../db.js';
import UserController from './user/user.controller.js';
import UserService from './user/user.service.js';
import FirebaseClient from '../lib/firebase.js';
import logger from '../lib/logger.js';

export default class ServiceFactory {
  static config;
  static instance;

  constructor() {}

  static init() {
    ServiceFactory.instance = new ServiceFactory(logger);
    ServiceFactory.config = config;
  }

  /**
   * @returns {Promise<Collection<User>>}
   */
  static async getUserRepository() {
   return getDb(config.mongo.collections.user.name);
  }

  /**
   * @returns {Promise<Collection<Restaurant>>}
   */
  static async getRestaurantRepository() {
    return getDb(config.mongo.collections.restaurant.name);
  }

  /**
   * @returns {FirebaseClient}
   */
  static async getFirebaseClient() {
    return new FirebaseClient();
  }

  /**
   * @returns {UserService}
   */
  static async getUserService() {
    const userRepository = await ServiceFactory.getUserRepository();
    const firebaseClient = await ServiceFactory.getFirebaseClient();
    const restaurantRepository = await ServiceFactory.getRestaurantRepository();

    return new UserService(logger, config, userRepository, firebaseClient, restaurantRepository);
  }

  /**
   * @returns {UserController}
   */
  static async getUserController() {
    const userService = await ServiceFactory.getUserService();
    return new UserController(userService, logger);
  }
}
