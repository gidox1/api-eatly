const UserSchema = {
  id: 'user',
  required: [ "name", "email", "role", "createdAt", "updatedAt" ],
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
    createdAt: {
      bsonType: "date",
      description: "The date the record was created"
    },
    updatedAt: {
      bsonType: "date",
      description: "The date the record was updated"
    }
  }
}

const RestaurantSchema = {
  id: 'restaurant',
  required: [ "name", "merchantId", "createdAt", "updatedAt" ],
  properties: {
    name: {
      bsonType: "string",
      description: "The name of the restaurant"
    },
    merchantId: {
      bsonType: "objectId",
      description: "The ID of the merchant" 
    },
    createdAt: {
      bsonType: "date",
      description: "The date the record was created"
    },
    updatedAt: {
      bsonType: "date",
      description: "The date the record was updated"
    }
  }
}

const BranchSchema = {
  id: 'branch',
  required: [ "name", "merchantId", "restaurantId", "status", "createdAt", "updatedAt"],
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
    },
    createdAt: {
      bsonType: "date",
      description: "The date the record was created"
    },
    updatedAt: {
      bsonType: "date",
      description: "The date the record was updated"
    }
  }
}

const ProductSchema = {
  id: 'product',
  required: [ "name", "description", "branchId", "cost", "status", "url", "imagePublicId", "createdAt", "updatedAt"],
  properties: {
    name: {
      bsonType: "string",
      description: "The name of the product"
    },
    description: {
      bsonType: "string",
      description: "The description of the product" 
    },
    branchId: {
      bsonType: "objectId",
      description: "The ID of the branch" 
    },
    status: {
      enum: [ "active", "inactive" ],
      description: "Must be either active or inactive"
    },
    cost: {
      bsonType: "double",
      description: "The cost of the product"
    },
    url: {
      bsonType: "string",
      description: "The imageUrl of the product" 
    },
    imagePublicId: {
      bsonType: "string",
      description: "The image publicId of the product" 
    },
    createdAt: {
      bsonType: "date",
      description: "The date the record was created"
    },
    updatedAt: {
      bsonType: "date",
      description: "The date the record was updated"
    }
  }
}

const OrderSchema = {
  id: 'order',
  required: [ "products", "userId", "status", "totalCost", "address", "createdAt", "updatedAt"],
  properties: {
    products: {
      bsonType: "array",
      description: "The IDs of the product",
      items: {
        bsonType: "object",
        required:["id", "qty", "sumTotal"],
        properties: {
          id: {
            bsonType: "objectId",
            description: "The ID of the product" 
          },
          qty: {
            bsonType: "int",
            description: "The quantities of the product",
          },
          sumTotal: {
            bsonType: "double",
            description: "The sum of all items cost for this product",
          }
        }
      }
    },
    userId: {
      bsonType: "objectId",
      description: "The ID of the user" 
    },
    totalCost: {
      bsonType: "double",
      description: "The total cost of the order"
    },
    status: {
      enum: [ "pending", "active", "cancelled" ],
      description: "Must be either active, pending or cancelled"
    },
    address: {
      bsonType: "object",
      description: "The address of the order",
      required:["street", "city", "state", "zipCode"],
      properties: {
        street: {
          bsonType: "string",
          description: "The street where the order is delivered to", 
        },
        city: {
          bsonType: "string",
          description: "The city where the order is delivered to", 
        },
        state: {
          bsonType: "string",
          description: "The state where the order is delivered to", 
        },
        zipCode: {
          bsonType: "string",
          description: "The zipCode where the order is delivered to", 
        }
      }
    },
    createdAt: {
      bsonType: "date",
      description: "The date the record was created"
    },
    updatedAt: {
      bsonType: "date",
      description: "The date the record was updated"
    }
  }
}

export default [
  UserSchema,
  BranchSchema,
  RestaurantSchema,
  ProductSchema,
  OrderSchema,
];
