import { Collection, ObjectId } from "mongodb";
import BranchService from "../branch/branch.service.js";
import * as TrueMyth from 'true-myth';
import { ok } from "true-myth/result";

export default class RestaurantService {
  /**
   * @param {*} logger 
   * @param {*} config 
   * @param {Collection<Document>} repository 
   * @param {BranchService} branchService 
   */
  constructor(logger, config, repository, branchService) {
    this.logger = logger;
    this.config = config;
    this.repository = repository;
    this.branchService = branchService;
  }

  /**
   * @param {Object} data 
   * @returns {TrueMyth.Result<[Restaurant>[], Branch[]], any>}
   */
  async list(data) {
    const metrics = {};
    const query = {
      page: data.page ?? this.config.pagination.page,
      pageSize: data.pageSize ?? this.config.pagination.pageSize,
      orderBy: this.config.pagination.orderBy,
      orderDirection: this.config.pagination.orderDirection,
    };
    metrics.query = query;

    try {
      const restaurants = await this.repository.find({}, {
        sort: { [query.orderBy]: query.orderDirection },
        skip: (query.page - 1) * query.pageSize,
        limit: query.pageSize,
      }).toArray();

      query.restaurantIds = restaurants.map((v) => v._id.toHexString());

      const branchesResult = await this.branchService.list(query);
      if (ok(branchesResult)) {
        metrics.foundBranches = 'true';
        this.logger.log('successfully listed restaurant data', metrics);
        return TrueMyth.Result.ok([restaurants, branchesResult.value]);
      }

      metrics.foundBranches = 'false';
      this.logger.log('successfully listed restaurant data', metrics);
      return TrueMyth.Result.ok([restaurants, []]);
    } catch(error) {
      this.logger.error('Restaurant list error: ', error);
      return TrueMyth.Result.err('An error occured while listing restaurants');
    }
  }

  /**
   * @param {ObjectId} id 
   */
  async getById(id) {
    const metrics ={};
    metrics.id = id;
    try {
      const restaurant = await this.repository.findOne({_id: new ObjectId(id)});
      if(restaurant === null) {
        this.logger.error('restaurant does not exist: ', metrics);
        return TrueMyth.Result.err(`restaurant with id ${id.toString()} does not exist`);
      }
      return TrueMyth.Result.ok(restaurant);
    } catch(error) {
      this.logger.error('Restaurant fetch error: ', error);
      return TrueMyth.Result.err('An error occured while getting restaurant by Id');
    }
  }
}
