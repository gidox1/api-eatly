import { authValidation } from '../../lib/auth.js';
import requestValidator from '../../lib/requestValidatior.js';
import { listPaymentValidation } from '../../routes/validations.js';
import ServiceFactory from '../factory.js';

export default async (app) => {
  const routePrefix = 'payment';
  const controller = await ServiceFactory.getPaymentController();
  
  /**
   * List payments
   */
  app.get(`/${routePrefix}`, 
  (req, res, next) => authValidation(req, res, next),
  (req, res, next) => requestValidator(req.body, listPaymentValidation, res, next),
  (req, res) => controller.list(req, res));
}
