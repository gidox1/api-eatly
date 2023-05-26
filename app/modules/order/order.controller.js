import { isErr, toJSON } from "true-myth/result";
import OrderService from "./order.service.js";
import { Logger } from "../../commands/logger.command.js";

export default class OrderController {
  /**
   * @param {OrderService} service 
   * @param {Logger} logger 
   */
  constructor(service, logger) {
    this.service = service;
    this.logger = logger;
  }

  /**
   * @param {Request} req 
   * @param {Response} res 
   */
  async create(req, res) {
    const { products, totalCost, address } = req.body;
    const { userId } = req.user; 

    const result = await this.service.create({
      products,
      totalCost,
      address,
      userId,
    });

    if(isErr(result)) {
      return res.status(500).json({
        error: true,
        message: toJSON(result).error,
      });
    }

    const response = toJSON(result).value;
    res.status(201).json({
      status: 'success',
      data: response,
    });
  }

  /**
   * @param {Request} req 
   * @param {Response} res 
   */
  async list(req, res) {
    console.log('controller');
    res.send({
      message: 'order!',
    });
  }

  /**
   * @param {Request} req 
   * @param {Response} res 
   */
  async getById(req, res) {
    console.log('controller');
    res.send({
      message: 'order!',
    });
  }

   /**
   * @param {Request} req 
   * @param {Response} res 
   */
    async update(req, res) {
      console.log('controller');
      res.send({
        message: 'order!',
      });
    }
}