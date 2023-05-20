'use strict'

import joi from 'joi';

export const createUserValidation = joi.object({
  name: joi.string().required(),
  email: joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }).required(),
  password: joi.string().required(),
  phoneNumber: joi.string().min(11).required(),
  restaurantName: joi.string().optional(),
  role: joi.string().valid('user', 'merchant').required(),
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

export const createBranchValidation = joi.object({
  restaurantId: joi.string().min(24).required(),
  name: joi.string().required(),
  city: joi.string().required(),
  address: joi.string().required(),
});