'use strict'

import joi from 'joi';

export const createUserValidation = joi.object({
  name: joi.string().required(),
  email: joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }).required(),
  password: joi.string().required(),
  phoneNumber: joi.string().min(6).required(),
  restaurantName: joi.string().optional(),
  role: joi.string().valid('user', 'merchant').required(),
});

export const updateUserValidation = joi.object({
  phoneNumber: joi.string().min(6).optional(),
  city: joi.string().min(6).optional(),
});

export const loginUserValidation = joi.object({
  email: joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }).required(),
  password: joi.string().required(),
});

export const listRestaurantValidation = joi.object({
  pageSize: joi.number().optional(),
  orderBy: joi.string().optional(),
  orderDirection: joi.number().optional(),
  page: joi.number().optional(),
});

export const listbranchesValidation = joi.object({
  pageSize: joi.number().optional(),
  orderBy: joi.string().optional(),
  orderDirection: joi.number().optional(),
  page: joi.number().optional(),
  restaurantIds: joi.array().optional(),
});

export const getRestaurantValidation = joi.object({
  restaurantId: joi.string().required(),
});

export const getBranchValidation = joi.object({
  branchId: joi.string().required(),
});

export const byId = joi.object({
  id: joi.string().required(),
});

export const createBranchValidation = joi.object({
  restaurantId: joi.string().min(24).required(),
  name: joi.string().required(),
  city: joi.string().required(),
  address: joi.string().required(),
});

export const createProductValidation = joi.object({
  description: joi.string().required(),
  name: joi.string().required(),
  restaurantId: joi.string().min(24).required(),
  cost: joi.number().required(),
});

export const listproductsValidation = joi.object({
  pageSize: joi.number().optional(),
  orderBy: joi.string().optional(),
  orderDirection: joi.number().optional(),
  page: joi.number().optional(),
  productIds: joi.array().optional(),
  restaurantIds: joi.array().optional(),
});


const product = joi.object({
  id: joi.string().required(),
  qty: joi.number().required(),
  unitCost: joi.number().required(),
  sumTotal: joi.number().required(),
})

export const createOrderValidation = joi.object({
  products: joi.array().items(product),
  totalCost: joi.number().required(),
  address: joi.object({
    street: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    zipCode: joi.string().required(),
  }),
  payment: joi.object({
    sourceId: joi.string(),
    idempotencyKey: joi.string(),
  }),
});

export const listPaymentValidation = joi.object({
  pageSize: joi.number().optional(),
  orderBy: joi.string().optional(),
  orderDirection: joi.number().optional(),
  page: joi.number().optional(),
  paymentIds: joi.array().optional(),
});
