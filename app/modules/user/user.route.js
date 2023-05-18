const ServiceFactory = require('../factory');

module.exports = async (app) => {
  const routePrefix = 'user';
  const userController = await ServiceFactory.getUserController();
  /**
   * create new user
   */
  app.post(`/${routePrefix}`, (req, res) => userController.create(req, res));
}
