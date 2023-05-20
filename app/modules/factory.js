import config from '../config.js';
import { getDb } from '../db.js';
import UserController from './user/user.controller.js';
import UserService from './user/user.service.js';
import FirebaseClient from '../lib/firebase.js';
import logger from '../lib/logger.js';
import RestaurantService from './restaurant/restaurant.service.js';
import BranchService from './branch/branch.service.js';
import RestaurantController from './restaurant/restaurant.controller.js';
import BranchController from './branch/branch.controller.js';

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
   * @returns {Promise<Collection<Branch>>}
   */
  static async getBranchRepository() {
    return getDb(config.mongo.collections.branch.name);
  }

  /**
   * @returns {FirebaseClient}
   */
  static async getFirebaseClient() {
    return new FirebaseClient(config);
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
   * @returns {BranchService}
   */
  static async getBranchService() {
    const branchRepository = await ServiceFactory.getBranchRepository();
    const restaurantRepository = await ServiceFactory.getRestaurantRepository();
    return new BranchService(logger, config, branchRepository, restaurantRepository);
  }

  /**
   * @returns {RestaurantService}
   */
  static async getRestaurantService() {
    const branchService = await ServiceFactory.getBranchService();
    const restaurantRepository = await ServiceFactory.getRestaurantRepository();
    return new RestaurantService(logger, config, restaurantRepository, branchService);
  }

  /**
   * @returns {UserController}
   */
  static async getUserController() {
    const userService = await ServiceFactory.getUserService();
    return new UserController(userService, logger);
  }

  /**
   * @returns {RestaurantController}
   */
  static async getRestaurantController() {
    const restaurantService = await ServiceFactory.getRestaurantService();
    return new RestaurantController(restaurantService, logger);
  }

  /**
   * @returns {BranchController}
   */
  static async getBranchController() {
    const branchService = await ServiceFactory.getBranchService();
    return new BranchController(branchService, logger);
  }
}
