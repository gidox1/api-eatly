import { authValidation } from '../../lib/auth.js';
import requestValidator from '../../lib/requestValidatior.js';
import { createBranchValidation, listbranchesValidation } from '../../routes/validations.js';
import ServiceFactory from '../factory.js';

export default async (app) => {
  const routePrefix = 'branch';
  const controller = await ServiceFactory.getBranchController();

  /**
   * create branch
   */
  app.post(`/${routePrefix}`,
  (req, res, next) => authValidation(req, res, next),
  (req, res, next) => requestValidator(req.body, createBranchValidation, res, next),
  (req, res) => controller.create(req, res));

  /**
   * List branches
   */
  app.get(`/${routePrefix}`, 
  (req, res, next) => authValidation(req, res, next),
  (req, res, next) => requestValidator(req.body, listbranchesValidation, res, next),
  (req, res) => controller.list(req, res));
}
