import { Collection, ObjectId } from "mongodb";
import { Config } from "../../commands/config.command.js";
import { Logger } from "../../commands/logger.command.js";
import { Payment, PaymentSources, PaymentStatuses, PaymentProviderResponse } from "../../commands/payment.command.js";
import * as TrueMyth from 'true-myth';
import client from './../../lib/square.js';

class PaymentService {
  /**
   * @param {Config} config 
   * @param {Logger} logger 
   * @param {Collection<Document>} repository
   * @param {Collection<Document>} orderRepository
   */
  constructor(logger, config, repository, orderRepository) {
    this.config = config;
    this.logger = logger;
    this.repository = repository;
    this.orderRepository = orderRepository;
  }

  /**
   * @param {Payment} data 
   * @param {String} id
   */
  async create(data, id) {
    let metrics = {};
    const paymentSource =  new ObjectId(id);
    const order = await this.orderRepository.findOne(paymentSource);
    if(order === null) {
      this.logger.error('order not found: ', {
        ...data,
        orderId: id,
      });
      return TrueMyth.Result.err(`failed to initiate payment: Order not found`);
    }
    metrics.orderId = order._id.toHexString();

    const insertOps = await this.repository.insertOne({
      source: PaymentSources.order,
      sourceId: order._id,
      cost: data.totalCost,
      status: PaymentStatuses.new,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.logger.log('successfully initiated order payment', metrics);
    metrics.paymentId = insertOps.insertedId.toHexString();
    return TrueMyth.Result.ok({
      id: insertOps.insertedId.toHexString(),
    });
  }

  /**
   * @param {*} paymentData 
   * @returns {PaymentProviderResponse}
   */
  async pay(paymentData) {
    try {
      const paymentResponse = await client.paymentsApi.createPayment(
        {
          locationId: this.config.square.locationId,
          sourceId: paymentData.sourceId,
          idempotencyKey: paymentData.idempotencyKey,
          amountMoney: { amount: (paymentData.amount * 1000), currency: 'USD' }
        }
      );
      const payment = paymentResponse.result.payment;
      this.logger.log('Payment successfull', {
        paymentId: payment.id,
        status: payment.status,
        orderId: payment.orderId,
      })
      return paymentResponse.result.payment;
    } catch(e) {
      throw e;
    }
  }

  /**
   * 
   * @param {PaymentProviderResponse} data 
   * @param {String} paymentId 
   * @returns 
   */
  async updatePayment(data, paymentId) {
    const id =  new ObjectId(paymentId);
    const payment = await this.repository.findOne(id);

    if(payment === null) {
      this.logger.error('Payment not found: ', {
        paymentId: payment._id,
      });
      return TrueMyth.Result.err(`Failed to update payment: Payment not found`);
    }

    await this.repository.updateOne({_id: id }, { 
      $set: {
        ...data,
      }
    });
    return await this.repository.findOne({_id: id});
  }
}

export default PaymentService;