const UserSchema = {
  id: 'user',
  required: [ "name", "email" ],
  properties: {
    name: {
      bsonType: "string",
      description: "The name of the user"
    },
    email: {
      bsonType: 'string',
      minLength: 6,
      maxLength: 40,
      pattern: '[a-z0-9._%+!$&*=^|~#%{}/-]+@([a-z0-9-]+.){1,}([a-z]{2,22})',
      description: 'User email. It is required and it must be a string with length between 6 and 40 (regular expression pattern)'
    },
    password: {
      bsonType: 'string',
      minLength: 6,
      maxLength: 80,
      description: 'It must be a string with max length 80 and min length of 6'
    },
    role: {
      enum: [ "user", "merchant" ],
      description: "Must be either user or merchant"
    },
    phoneNumber: {
      bsonType: "string",
      description: "The phone number of the user"
    },
  }
}

const RestaurantSchema = {
  id: 'restaurant',
  required: [ "name", "merchantId" ],
  properties: {
    name: {
      bsonType: "string",
      description: "The name of the restaurant"
    },
    merchantId: {
      bsonType: "objectId",
      description: "The ID of the merchant" 
    },
  }
}

const BranchSchema = {
  id: 'branch',
  required: [ "name", "merchantId", "restaurantId", "status"],
  properties: {
    name: {
      bsonType: "string",
      description: "The name of the branch"
    },
    restaurantId: {
      bsonType: "objectId",
      description: "The ID of the restaurant" 
    },
    merchantId: {
      bsonType: "objectId",
      description: "The ID of the merchant" 
    },
    city: {
      bsonType: "string",
      description: "The city where the restaurant branch is located"
    },
    status: {
      enum: [ "active", "inactive" ],
      description: "Must be either active or inactive"
    },
    address: {
      bsonType: "string",
      description: "The address of the restaurant branch"
    }
  }
}

export default [
  UserSchema,
  BranchSchema,
  RestaurantSchema
]