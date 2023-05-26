import { Double } from "mongodb";

export class CreateOrder {
  products = [{
    id: new String(),
    qty: new Number(),
    sumTotal: new Double(),
  }];
  totalCost = new Double();
  address = {
    street: new String(),
    city: new String(),
    state: new String(),
    zipCode: new String(),
  }
  userId = new String();
}
