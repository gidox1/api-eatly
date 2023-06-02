import { Product } from "../../commands/product.command.js"
import { Statuses } from "../../constants.js"

/**
 * Returns the Product domain
 * @param {Product} data 
 * @returns 
 */
export const productMapper = (data, branchId, restaurant, imageUrl, publicId) => {
  const resp = {
    name: data.name,
    description: data.description,
    restaurantName: restaurant.name,
    restaurantId: restaurant._id,
    status: Statuses.active,
    cost: data.cost,
    url: imageUrl,
    imagePublicId: publicId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  if(branchId) {
    return {
      ...resp,
      branchId,
    }
  }

  return resp;
}

/**
 * 
 * @param {Product[]} productData 
 */
export const listProductMapper = (productData) => {
  const productIds = productData.map((v) => v._id);
  
}