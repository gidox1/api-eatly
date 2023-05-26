import requestValidator from '../../lib/requestValidatior.js';
import { byId, createUserValidation, loginUserValidation } from '../../routes/validations.js';
import ServiceFactory from '../factory.js';
import { authValidation } from '../../lib/auth.js';

export default async (app) => {
  const routePrefix = 'user';
  const userController = await ServiceFactory.getUserController();
  
  /**
   * create new user
   */
  app.post(`/${routePrefix}`, 
  (req, res, next) => requestValidator(req.body, createUserValidation, res, next),
  (req, res) => userController.create(req, res));

  /**
   * login user
   */
  app.post(`/${routePrefix}/login`, 
  (req, res, next) => requestValidator(req.body, loginUserValidation, res, next),
  (req, res) => userController.login(req, res));

  /**
   * Get user
   */
    app.get(`/${routePrefix}/:id`, 
    (req, res, next) => authValidation(req, res, next),
    (req, res, next) => requestValidator(req.params, byId, res, next),
    (req, res) => userController.getById(req, res));
}
