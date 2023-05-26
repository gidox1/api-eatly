import { ObjectId } from "mongodb";
import { Config } from "../../commands/config.command.js";
import { Logger } from "../../commands/logger.command.js";
import { CreateOrder } from "../../commands/order.command.js";
import { OrderStatuses } from "../../constants.js";
import { ProductService } from "../product/product.service.js";
import UserService from "../user/user.service.js";
import { isErr, toJSON } from "true-myth/result";

export default class OrderHelper {
  /**
   * @param {UserService} userService 
   * @param {ProductService} productService 
   * @param {Logger} logger 
   * @param {Config} config 
   */
  constructor(userService, productService, logger, config) {
    this.userService = userService;
    this.productService = productService;
    this.logger = logger;
    this.config = config;
  }

  /**
   * @param {String[]} productIds 
   */
  async validateProducts(productIds) {
    let products = await this.productService.list(productIds);
    if(isErr(products)) {
      throw new Error(products.error);
    }
    return toJSON(products).value;
  }

  /**
   * 
   * @param {CreateOrder} data 
   */
  mapOrderData(data) {
    const totalCost = this.$computeCost(data.products);
    return {
      ...data,
      totalCost,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: OrderStatuses.active,
      userId: new ObjectId(data.userId),
      products: data.products.map((v) => {
        return {
          ...v,
          id: new ObjectId(v.id),
        }
      })
    };
  }

  /**
   * 
   * @param {*} products 
   */
  $computeCost(products) {
    return products.reduce((prev, curr) => prev + curr.sumTotal, 0);
  }
}