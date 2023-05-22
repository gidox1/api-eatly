import { ObjectId } from "mongodb";

export class Product {
  name = new String();
  description = new String();
  branchId = new ObjectId();
  cost = new Number();
  status = new String();
  createdAt = new Date();
  updatedAt = new Date();
}

export class CreateProduct {
  name = new String();
  description = new String();
  branchId = new ObjectId();
  cost = new Number();
  merchantId = new String();
  productImage = new File();
}

