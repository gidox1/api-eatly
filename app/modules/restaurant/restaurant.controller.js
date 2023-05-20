import { restaurantMapper } from "./restaurant.helper.js";
import RestaurantService from "./restaurant.service.js";
import { isErr, toJSON } from "true-myth/result";

export default class RestaurantController {
  /**
   * 
   * @param {RestaurantService} service 
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
  async list(req, res) {
    const listFilters = {
      page: +req.body.page,
      pageSize: +req.body.pageSize,
      orderBy: req.body.orderBy,
      orderDirection: +req.body.orderDirection
    }
    const result = await this.service.list(listFilters);

    if(isErr(result)) {
      return res.status(500).json({
        error: true,
        message: toJSON(result).error,
      });
    }

    const response = toJSON(result).value;
    const mappedResponse = restaurantMapper(response[0], response[1]);
    res.status(201).json({
      status: 'success',
      data: mappedResponse,
    })
  }

  /**
   * @param {Request} req 
   * @param {Response} res 
   */
    async getById(req, res) {
      const { restaurantId } = req.params;
      const result = await this.service.getById(restaurantId);

      if(isErr(result)) {
        return res.status(500).json({
          error: true,
          message: toJSON(result).error,
        });
      }

      const response = toJSON(result).value;
      this.logger.log('successfully fetched resturants');
      res.status(201).json({
        status: 'success',
        data: response,
      });
    }
}