import { ObjectId } from "mongodb";
import { Config } from "../../commands/config.command.js";
import { Logger } from "../../commands/logger.command.js";
import { CreateOrder } from "../../commands/order.command.js";
import { OrderStatuses } from "../../constants.js";
import { ProductService } from "../product/product.service.js";
import { isErr, toJSON } from "true-myth/result";
import PaymentService from "../payment/payment.service.js";

export default class OrderHelper {
  /**
   * @param {PaymentService} userService 
   * @param {ProductService} productService 
   * @param {Logger} logger 
   * @param {Config} config 
   */
  constructor(paymentService, productService, logger, config) {
    this.paymentService = paymentService;
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
    return {
      totalCost: data.totalCost,
      address: data.address,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: OrderStatuses.active,
      userId: new ObjectId(data.userId),
      products: data.products.map((v) => {
        return {
          ...v,
          unitCost: +v.unitCost,
          id: new ObjectId(v.id),
          sumTotal: (v.qty * +v.unitCost),
          name: v.name,
          restaurantName: v.restaurantName,
          url: v.url,
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