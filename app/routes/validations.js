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
