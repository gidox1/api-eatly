const logger = require('turbo-logger');
const config = require('../config');
const { getDb } = require('../db');
const UserController = require('./user/user.controller');
const UserService = require('./user/user.service');

class ServiceFactory {
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
   * @returns {UserService}
   */
  static async getUserService() {
    const userRepository = await ServiceFactory.getUserRepository();
    return new UserService(logger, config, userRepository);
  }

  /**
   * @returns {UserController}
   */
  static async getUserController() {
    const userService = await ServiceFactory.getUserService();
    return new UserController(userService, logger);
  }
}

module.exports = ServiceFactory;