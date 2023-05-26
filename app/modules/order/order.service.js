import { Collection } from "mongodb";
import { Config } from "../../commands/config.command.js";
import { Logger } from "../../commands/logger.command.js";
import UserService from "../user/user.service.js";
import { ProductService } from "../product/product.service.js";
import { CreateOrder } from "../../commands/order.command.js";
import OrderHelper from "./order.helper.js";
import * as TrueMyth from 'true-myth';

export default class OrderService {
  /**
   * @param {Logger} logger 
   * @param {Config} config 
   * @param {Collection<Document>} repository 
   * @param {UserService} userService 
   * @param {ProductService} productService 
   */
  constructor(logger, config, repository, userService, productService) {
    this.config = config;
    this.repository = repository;
    this.logger = logger;
    this.userService = userService;
    this.productService = productService; 
    this.helper = new OrderHelper(userService, productService, logger, config);
  }

  /**
   * Create new order
   * @param {CreateOrder} data 
   */
  async create(data) {
    const metrics = {};
    metrics.productsLength = data.products.length;
    metrics.userId = data.userId;

    const ids = data.products.map((v) => v.id);
    try {
      const products = await this.helper.validateProducts({
        productIds: ids
      });

      const orderPayload = this.helper.mapOrderData(data);
      data.products = data.products.map((v) => {
        const product = products.find((item) => item._id.toHexString() === v.id);
        return {
          ...v,
          sumTotal: product.cost,
        }
      });

      const insertOps = await this.repository.insertOne(orderPayload);
      metrics.orderId = insertOps.insertedId.toHexString();

      this.logger.log('Successfully created order :', metrics);
      return TrueMyth.Result.ok({
        id: insertOps.insertedId.toHexString(),
        userId: data.userId,
      });
    } catch(error) {
      this.logger.error('Create Order Error', error, { metrics });
      return TrueMyth.Result.err('An error occured while creating order');
    }
  }

  async list(options) {
    console.log('controller');
    res.send({
      message: 'order!',
    });
  }

  async getById(id) {
    console.log('controller');
    res.send({
      message: 'order!',
    });
  }

  async update(id) {
    console.log('controller');
    res.send({
      message: 'order!',
    });
  }
}