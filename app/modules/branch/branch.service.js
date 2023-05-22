import { Collection, ObjectId } from "mongodb";
import * as TrueMyth from 'true-myth';
import { Statuses } from "../../constants.js";
import { Branch } from "../../commands/branch.command.js";

export default class BranchService {
  /**
   * 
   * @param {*} logger 
   * @param {*} config 
   * @param {Collection<Document>} repository 
   * @param {Collection<Document>} restaurantRepository 
   */
  constructor(logger, config, repository, restaurantRepository) {
    this.logger = logger;
    this.config = config;
    this.repository = repository;
    this.restaurantRepository = restaurantRepository;
  }

  /**
   * @param {Object} data 
   */
  async create(data) {
    const metrics = {};
    metrics.restaurantId = data.restaurantId;
    metrics.name = data.name;
    metrics.city = data.city;
    metrics.address = data.address;
    metrics.merchantId = data.merchantId;

    try {
      const restaurant = await this.restaurantRepository.findOne({_id: new ObjectId(data.restaurantId), merchantId: new ObjectId(data.merchantId)});
      if(restaurant ===  null) {
        this.logger.error('restaurant does not exist: ', metrics);
        return TrueMyth.Result.err(`restaurant does not exist or belong to current merchant`);
      }

      const existingBranch = await this.repository.findOne({ name: data.name, restaurantId: restaurant._id });
      if(existingBranch) {
        metrics.branchExists = 'true';
        this.logger.error('branch already exist: ', metrics);
        return TrueMyth.Result.err(`branch with name ${data.name} already exist`);
      }
      metrics.branchExists = 'false';

      const insertOps = await this.repository.insertOne({
        name: data.name,
        city: data.city,
        address: data.address,
        restaurantId: restaurant._id,
        merchantId: restaurant.merchantId,
        status: Statuses.active,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      this.logger.log('successfully created branch ', metrics);
      return TrueMyth.Result.ok({
        name: data.name,
        merchantId: restaurant.merchantId.toHexString(),
        restaurantId: restaurant._id,
        id: insertOps.insertedId.toHexString(),
      });
    } catch(error) {
      this.logger.error('Branch create error: ', error, metrics);
      return TrueMyth.Result.err('An error occured while creating branch');
    }
  }

  /**
   * @param {Object} data 
   * @returns {TrueMyth.Result<WithId<Document>[], any>>}
   */
  async list(data) {
    const searchFilters = {};
    const query = {
      page: data.page ?? this.config.pagination.page,
      pageSize: data.pageSize ?? this.config.pagination.pageSize,
      orderBy: this.config.pagination.orderBy,
      orderDirection: this.config.pagination.orderDirection,
    };
    
    if(data.restaurantIds) {
      const ids = data.restaurantIds.map((id) => new ObjectId(id));
      searchFilters.restaurantId = { $in: ids };
    }

    try {
      const branches = await this.repository.find(searchFilters, {
        sort: { [query.orderBy]: query.orderDirection },
        skip: (query.page - 1) * query.pageSize,
        limit: query.pageSize,
      }).toArray();
      return TrueMyth.Result.ok(branches);
    } catch(error) {
      this.logger.error('Restaurant list error: ', error);
      return TrueMyth.Result.err('An error occured while listing restaurants');
    }
  }

   /**
   * @param {String} id 
   * @returns {TrueMyth.Result<WithId<Branch>, any>} 
   */
    async getById(id) {
      if(!id) {
        return TrueMyth.Result.err(`branchId is required`);
      }
      const metrics ={};
      metrics.id = id;
      try {
        const branch = await this.repository.findOne({_id: new ObjectId(id)});
        if(branch === null) {
          this.logger.error('branch does not exist: ', metrics);
          return TrueMyth.Result.err(`branch with id ${id.toString()} does not exist`);
        }
        return TrueMyth.Result.ok(branch);
      } catch(error) {
        this.logger.error('Branch fetch error: ', error);
        return TrueMyth.Result.err('An error occured while getting branch by Id');
      }
    }
}
