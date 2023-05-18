const userRoutes = require('../modules/user/user.route');

module.exports = (app) => {
  userRoutes(app);
}
