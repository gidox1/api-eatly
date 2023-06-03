import { Collection, ObjectId } from "mongodb";
import { Config } from "../../commands/config.command.js";
import { Logger } from "../../commands/logger.command.js";
import UserService from "../user/user.service.js";
import { ProductService } from "../product/product.service.js";
import { CreateOrder } from "../../commands/order.command.js";
import OrderHelper from "./order.helper.js";
import * as TrueMyth from 'true-myth';
import PaymentService from "../payment/payment.service.js";
import { isErr, toJSON } from "true-myth/result";
import { PaymentStatuses } from "../../commands/payment.command.js";

export default class OrderService {
  /**
   * @param {Logger} logger 
   * @param {Config} config 
   * @param {Collection<Document>} repository 
   * @param {PaymentService} paymentService 
   * @param {ProductService} productService 
   */
  constructor(logger, config, repository, paymentService, productService) {
    this.config = config;
    this.repository = repository;
    this.logger = logger;
    this.paymentService = paymentService;
    this.productService = productService; 
    this.helper = new OrderHelper(paymentService, productService, logger, config);
  }

  /**
   * Create new order
   * @param {CreateOrder} data 
   */
  async create(data) {
    data.totalCost = +data.totalCost;
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
      const orderId = insertOps.insertedId.toHexString();
      metrics.orderId = orderId;
      let paymentResponse = await this.paymentService.create(data, orderId);
      paymentResponse = toJSON(paymentResponse).value;

      const paymentId = paymentResponse.id;
      metrics.paymentId = paymentId;

      const payment = await this.paymentService.pay({
        ...data.payment,
        amount: data.totalCost,
      });
      metrics.externalPaymentId = payment.paymentId;

      await this.paymentService.updatePayment({
        orderId: payment.orderId,
        externalPaymentId: payment.id,
        status: PaymentStatuses.success,
        receiptUrl: payment.receiptUrl,
      }, paymentId);

      this.logger.log('successfully created order and payment', metrics);
      return TrueMyth.Result.ok({
        id: orderId,
        paymentId,
        externalPaymentId: payment.id,
      });

    } catch(error) {
      this.logger.error('Create Order Error', error, { metrics });
      return TrueMyth.Result.err('An error occured while creating order');
    }
  }

  async list(data) {
    const searchFilters = {};
    const query = {
      page: data.page ?? this.config.pagination.page,
      pageSize: data.pageSize ?? this.config.pagination.pageSize,
      orderBy: this.config.pagination.orderBy,
      orderDirection: this.config.pagination.orderDirection,
    };
    
    if(data.userId) {
      searchFilters.userId = new ObjectId(data.userId);
    }

    try {
      const orders = await this.repository.find(searchFilters, {
        sort: { [query.orderBy]: query.orderDirection },
        skip: (query.page - 1) * query.pageSize,
        limit: query.pageSize,
      }).toArray();
      return TrueMyth.Result.ok(orders);
    } catch(error) {
      this.logger.error('Order list error: ', error);
      return TrueMyth.Result.err('An error occured while listing orders');
    }
  }

   /**
   * @param {String} id 
   * @returns {TrueMyth.Result<WithId<Order>, any>} 
   */
   async getById(id) {
    if(!id) {
      return TrueMyth.Result.err(`orderId is required`);
    }
    const metrics ={};
    metrics.id = id;
    try {
      const order = await this.repository.findOne({_id: new ObjectId(id)});
      if(order === null) {
        this.logger.error('order does not exist: ', metrics);
        return TrueMyth.Result.err(`order with id ${id.toString()} does not exist`);
      }
      return TrueMyth.Result.ok(order);
    } catch(error) {
      this.logger.error('Order fetch error: ', error);
      return TrueMyth.Result.err('An error occured while getting order by Id');
    }
  }

  async update(id) {
    console.log('controller');
    res.send({
      message: 'order!',
    });
  }
}