/**
 * Map branches to restaurants
 * @param {Object[]} restaurants 
 * @param {Object[]} branches 
 */
export function restaurantMapper(restaurants, branches) {
  return restaurants.map((restaurant) => {
    const allBranches = branches.filter((v) => v.restaurantId.toHexString() === restaurant._id.toHexString());
    return {
      ...restaurant,
      branches: allBranches,
    }
  });
}
