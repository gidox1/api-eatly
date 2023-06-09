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
import { Product } from '../commands/product.command.js';
import { ProductController } from './product/product.controller.js';
import { ProductService } from './product/product.service.js';
import { Cloudinary } from '../lib/cloudinary.js';
import OrderService from './order/order.service.js';
import OrderController from './order/order.controller.js';
import PaymentController from './payment/payment.controller.js';
import PaymentService from './payment/payment.service.js';

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
   * @returns {Promise<Collection<Restaurant>>}
   */
  static async getOrderRepository() {
    return getDb(config.mongo.collections.order.name);
  }

  /**
   * @returns {Promise<Collection<Branch>>}
   */
  static async getBranchRepository() {
    return getDb(config.mongo.collections.branch.name);
  }

  /**
   * @returns {Promise<Collection<Product>>}
   */
  static async getProductRepository() {
    return getDb(config.mongo.collections.product.name);
  }

  /**
   * @returns {Promise<Collection<Product>>}
   */
  static async getPaymentRepository() {
    return getDb(config.mongo.collections.payment.name);
  }

  /**
   * @returns {FirebaseClient}
   */
  static async getFirebaseClient() {
    return new FirebaseClient(config);
  }

  /**
   * @returns {Cloudinary}
   */
  static async getCloudinaryClient() {
    return new Cloudinary(config, logger);
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
   * @returns {OrderService}
   */
  static async getOrderService() {
    const paymentService = await ServiceFactory.getPaymentService();
    const orderRepository = await ServiceFactory.getOrderRepository();
    const productService = await ServiceFactory.getProductService();
    return new OrderService(logger, config, orderRepository, paymentService, productService);
  }

  /**
   * @returns {ProductService}
   */
  static async getProductService() {
    const repository = await ServiceFactory.getProductRepository();
    const branchService = await ServiceFactory.getBranchService();
    const restaurantService = await ServiceFactory.getRestaurantService();
    const cloudinaryClient = await ServiceFactory.getCloudinaryClient();
    return new ProductService(logger, config, repository, branchService, restaurantService, cloudinaryClient);
  }

  /**
   * @returns {ProductService}
   */
  static async getPaymentService() {
    const repository = await ServiceFactory.getPaymentRepository();
    const orderRepository = await ServiceFactory.getOrderRepository();
    return new PaymentService(logger, config, repository, orderRepository);
  }

  /**
   * @returns {UserController}
   */
  static async getUserController() {
    const userService = await ServiceFactory.getUserService();
    return new UserController(userService, logger);
  }

  /**
   * @returns {OrderController}
   */
  static async getOrderController() {
    const service = await ServiceFactory.getOrderService();
    return new OrderController(service, logger);
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

  /**
   * @returns {ProductController}
   */
  static async getProductController() {
    const service = await ServiceFactory.getProductService();
    return new ProductController(service, logger);
  }

    /**
   * @returns {PaymentController}
   */
    static async getPaymentController() {
      const service = await ServiceFactory.getPaymentService();
      return new PaymentController(service, logger);
    }
}