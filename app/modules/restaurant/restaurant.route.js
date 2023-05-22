import { authValidation } from '../../lib/auth.js';
import requestValidator from '../../lib/requestValidatior.js';
import { getRestaurantValidation, listRestaurantValidation } from '../../routes/validations.js';
import ServiceFactory from '../factory.js';

export default async (app) => {
  const routePrefix = 'restaurant';
  const controller = await ServiceFactory.getRestaurantController();
  
  /**
   * List restaurants
   */
  app.get(`/${routePrefix}`, 
  (req, res, next) => authValidation(req, res, next),
  (req, res, next) => requestValidator(req.body, listRestaurantValidation, res, next),
  (req, res) => controller.list(req, res));

  /**
   * Get restaurant
   */
  app.get(`/${routePrefix}/:restaurantId`, 
  (req, res, next) => authValidation(req, res, next),
  (req, res, next) => requestValidator(req.params, getRestaurantValidation, res, next),
  (req, res) => controller.getById(req, res));
}
