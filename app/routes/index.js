import branchRoutes from '../modules/branch/branch.route.js';
import orderRoute from '../modules/order/order.route.js';
import productRoute from '../modules/product/product.route.js';
import restaurantRoutes from '../modules/restaurant/restaurant.route.js';
import userRoutes from '../modules/user/user.route.js';

export default (app) => {
  userRoutes(app);
  restaurantRoutes(app);
  branchRoutes(app);
  productRoute(app);
  orderRoute(app);
}
