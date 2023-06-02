import { isErr, toJSON } from "true-myth/result";
import { ProductService } from "./product.service.js";

export class ProductController {
  /**
   * @param {ProductService} service 
   * @param {*} logger 
   */
  constructor(service, logger){
    this.service = service;
    this.logger = logger
  }

  /**
   * Create products
   * @param {Request} req 
   * @param {Response} res 
   */
  async create(req, res){
    const { name, description, restaurantId, cost } = req.body;
    const { userId } = req.user;

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        error: true,
        message: 'Product image is required to be sent.',
      });
    }

    const result = await this.service.create({
      name,
      description,
      restaurantId,
      cost: Number(cost),
      merchantId: userId,
      productImage: req.files,
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
   * List products based on filters
   * @param {Request} req 
   * @param {Response} res 
   */
  async list(req, res){
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
   * Delete product(s)
   * @param {Request} req 
   * @param {Response} res 
   */
  async delete(req, res){
    console.log('product service')
    res.send({
      status: 'true'
    })
  }
}