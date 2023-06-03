import { authValidation } from '../../lib/auth.js';
import requestValidator from '../../lib/requestValidatior.js';
import { createOrderValidation, listOrderValidation } from '../../routes/validations.js';
import ServiceFactory from '../factory.js';

export default async (app) => {
  const routePrefix = 'order';
  const controller = await ServiceFactory.getOrderController();
  
  /**
   * create new order
   */
  app.post(`/${routePrefix}`, 
  (req, res, next) => authValidation(req, res, next),
  (req, res, next) => requestValidator(req.body, createOrderValidation, res, next),
  (req, res) => controller.create(req, res));

  /**
   * List orders
   */
    app.get(`/${routePrefix}`, 
    (req, res, next) => authValidation(req, res, next),
    (req, res, next) => requestValidator(req.body, listOrderValidation, res, next),
    (req, res) => controller.list(req, res));
}
