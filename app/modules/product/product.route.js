import { authValidation } from '../../lib/auth.js';
import requestValidator from '../../lib/requestValidatior.js';
import { createProductValidation, listproductsValidation } from '../../routes/validations.js';
import ServiceFactory from '../factory.js';

export default async (app) => {
  const routePrefix = 'product';
  const controller = await ServiceFactory.getProductController();
  
  /**
   * create new product
   */
  app.post(`/${routePrefix}`, 
  (req, res, next) => authValidation(req, res, next),
  (req, res, next) => requestValidator(req.body, createProductValidation, res, next),
  (req, res) => controller.create(req, res));

  /**
   * List products
   */
  app.get(`/${routePrefix}`, 
  (req, res, next) => authValidation(req, res, next),
  (req, res, next) => requestValidator(req.body, listproductsValidation, res, next),
  (req, res) => controller.list(req, res));
}
