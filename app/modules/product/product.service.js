import { Collection, ObjectId } from "mongodb";
import { Config } from "../../commands/config.command.js";
import { CreateProduct, Product } from "../../commands/product.command.js";
import BranchService from "../branch/branch.service.js";
import RestaurantService from "../restaurant/restaurant.service.js";
import { isErr, toJSON} from "true-myth/result";
import * as TrueMyth from 'true-myth';
import { productMapper } from "./product.mapper.js";

export class ProductService {
  /**
   * @param {*} logger 
   * @param {Config} config 
   * @param {Collection<Document>} repository 
   * @param {BranchService} branchService 
   * @param {RestaurantService} restaurantService 
   */
  constructor(logger, config, repository, branchService, restaurantService, cloudinaryClient){
    this.logger = logger;
    this.config = config;
    this.repository = repository;
    this.branchService = branchService;
    this.restaurantService = restaurantService;
    this.cloudinaryClient = cloudinaryClient;
  }

  /**
   * @param {CreateProduct} data 
   * @returns {Product} The created product
   */
    async create(data) {
      const metrics = {...data};
      try {
        // Check if product exists
        const existingProduct = await this.repository.findOne({ name: data.name, branch: new ObjectId(data.branchId) });
        if(existingProduct) {
          this.logger.error('Product already exists', metrics);
          return TrueMyth.Result.err('Product already exists');
        }

        // Validate branch data
        const branchResult = await this.branchService.getById(data.branchId);
        if(isErr(branchResult)){
          this.logger.error('Branch fetch error: ', branchResult.error);
          return TrueMyth.Result.err('Branch not found');
        }
        const branch = toJSON(branchResult).value;
  
        // Validate restaurant data
        const restaurantResult = await this.restaurantService.getById(branch.restaurantId.toHexString());
        if(isErr(restaurantResult)){
          this.logger.error('Restaurant fetch error: ', restaurantResult.error);
          return TrueMyth.Result.err('Restaurant not found');
        }
        const restaurant = toJSON(restaurantResult).value;
  
        // Validate merchant data
        if(restaurant.merchantId.toHexString() !== data.merchantId) {
          this.logger.error('Restaurant does not belong to this merchant', { ...metrics, validMerchantId: restaurant.merchantId.toHexString()});
          return TrueMyth.Result.err('Restaurant does not belong to this merchant');
        }
  
        // Upload file to Cloudinary
        const restaurantImage = data.productImage.image;
        const cloudinaryResponse = await this.cloudinaryClient.uploadImage(restaurantImage.tempFilePath);
        const imageUrl = cloudinaryResponse.url;
        const imagePublicId = cloudinaryResponse.public_id;
        metrics.publicId = imagePublicId;
        const createProductData = productMapper(data, branch._id, restaurant.name, imageUrl, imagePublicId);

        // Create product
        const insertOps = await this.repository.insertOne(createProductData);
        metrics.productId = insertOps.insertedId.toHexString();
        return TrueMyth.Result.ok({
          name: data.name,
          merchantId: data.merchantId,
          restaurantId: restaurant._id,
          id: insertOps.insertedId.toHexString(),
          url: imageUrl,
        });
      }
      catch (error) {
        if(metrics.publicId) {
          this.logger.log('deleting asset from cloudinary')
          await this.cloudinaryClient.cloudinaryDelete(metrics.publicId);
        }
        this.logger.error('Branch create error: ', error, metrics);
        return TrueMyth.Result.err('An error occured while creating branch');
      }
    }
  
    async list(data){
      const searchFilters = {};
      const query = {
        page: data.page ?? this.config.pagination.page,
        pageSize: data.pageSize ?? this.config.pagination.pageSize,
        orderBy: this.config.pagination.orderBy,
        orderDirection: this.config.pagination.orderDirection,
      };
      
      if(data.productIds) {
        const ids = data.productIds.map((id) => new ObjectId(id));
        searchFilters._id = { $in: ids };
      }

      try {
        const products = await this.repository.find(searchFilters, {
          sort: { [query.orderBy]: query.orderDirection },
          skip: (query.page - 1) * query.pageSize,
          limit: query.pageSize,
        }).toArray();
        return TrueMyth.Result.ok(products);
      } catch(error) {
        this.logger.error('Restaurant list error: ', error);
        return TrueMyth.Result.err('An error occured while listing restaurants');
      }
    }
  

    async delete(req, res){
      
    }
}