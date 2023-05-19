import requestValidator from '../../lib/requestValidatior.js';
import { createUserValidation } from '../../routes/validations.js';
import ServiceFactory from '../factory.js';

export default async (app) => {
  const routePrefix = 'user';
  const userController = await ServiceFactory.getUserController();
  
  /**
   * create new user
   */
  app.post(`/${routePrefix}`, 
  (req, res, next) => requestValidator(req.body, createUserValidation, res, next),
  (req, res) => userController.create(req, res));
}
