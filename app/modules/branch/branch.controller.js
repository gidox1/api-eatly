import BranchService from "./branch.service.js";
import { isErr, toJSON } from "true-myth/result";

export default class BranchController {
  /**
   * @param {BranchService} service 
   * @param {*} logger 
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
    const { name, restaurantId, city, address } = req.body;
    const { userId } = req.user; 
    const result = await this.service.create({
      name,
      restaurantId,
      city,
      address,
      merchantId: userId,
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
    const listFilters = {
      page: +req.body.page,
      pageSize: +req.body.pageSize,
      orderBy: req.body.orderBy,
      orderDirection: +req.body.orderDirection,
      restaurantIds: req.body.restaurantIds ?? null,
    };

    const result = await this.service.list(listFilters);
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
   async getById(req, res) {
      const { branchId } = req.params;
      const result = await this.service.getById(branchId);

      if(isErr(result)) {
        return res.status(500).json({
          error: true,
          message: toJSON(result).error,
        });
      }

      const response = toJSON(result).value;
      this.logger.log('successfully fetched branches');
      res.status(201).json({
        status: 'success',
        data: response,
      });
    }
}