import { Product } from "../../commands/product.command.js"
import { Statuses } from "../../constants.js"

/**
 * Returns the Product domain
 * @param {Product} data 
 * @returns 
 */
export const productMapper = (data, branchId, imageUrl, publicId) => {
  return {
    name: data.name,
    description: data.description,
    branchId: branchId,
    status: Statuses.active,
    cost: data.cost,
    url: imageUrl,
    imagePublicId: publicId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}
