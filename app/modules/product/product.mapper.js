import { Product } from "../../commands/product.command.js"
import { Statuses } from "../../constants.js"

/**
 * Returns the Product domain
 * @param {Product} data 
 * @returns 
 */
export const productMapper = (data, branchId, restaurantName, imageUrl, publicId) => {
  return {
    name: data.name,
    description: data.description,
    branchId: branchId,
    restaurantName,
    status: Statuses.active,
    cost: data.cost,
    url: imageUrl,
    imagePublicId: publicId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

/**
 * 
 * @param {Product[]} productData 
 */
export const listProductMapper = (productData) => {
  const productIds = productData.map((v) => v._id);
  
}