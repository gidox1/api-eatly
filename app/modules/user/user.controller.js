import { isErr, toJSON } from "true-myth/result";
import UserService from "./user.service.js";

class UserController {
  /**
   * @param {UserService} service 
   * @param {*} logger 
   */
  constructor(service, logger){
    this.service = service;
    this.logger = logger;
  }

  /**
   * @param {Request} req
   * @param {Response} res
   */
  async create(req, res) {
    const { name, email, password, phoneNumber, role } = req.body;
    const result = await this.service.create({
      name,
      email,
      password,
      phoneNumber,
      role,
      restaurantName: req.body.restaurantName ?? undefined,
    });

    if(isErr(result)) {
      return res.status(500).json({
        error: true,
        message: toJSON(result).error,
      });
    }

    const response = toJSON(result).value;
    this.logger.log('successfully created user: ', response);
    res.status(201).json({
      status: 'success',
      data: response,
    });
  }

    /**
   * @param {Request} req
   * @param {Response} res
   */
    async login(req, res) {
      const { email, password } = req.body;
      const result = await this.service.login({
        email,
        password,
      });
  
      if(isErr(result)) {
        return res.status(500).json({
          error: true,
          message: toJSON(result).error,
        });
      }
  
      const response = toJSON(result).value;
      this.logger.log('successfully authenticated user: ', email);
      res.status(201).json({
        status: 'success',
        data: response,
      })
    }

  /**
   * @param {Request} req 
   * @param {Response} res 
   */
   async getById(req, res) {
    const { id } = req.params;
    const result = await this.service.getById(id);

    if(isErr(result)) {
      return res.status(500).json({
        error: true,
        message: toJSON(result).error,
      });
    }

    const response = toJSON(result).value;
    this.logger.log('successfully fetched users');
    res.status(201).json({
      status: 'success',
      data: response,
    });
  }
}

export default UserController;