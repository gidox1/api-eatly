import { ObjectId } from "mongodb";
export const PaymentSources  = {
  order: 'order',
  shipping: 'shipping',
}
export const PaymentStatuses = {
  new: 'new',
  failed: 'failed',
  success: 'success'
}
export class Payment {
  _id = new ObjectId();
  source = new PaymentSources();
  sourceId = new ObjectId();
  cost = new Number();
  status = new PaymentStatuses();
  createdAt = new Date();
  updatedAt = new Date();
  externalPaymentId = new String();
  orderId = new String();
  receiptUrl = new String();
}
export class PaymentModel {
  source = new PaymentSources();
  sourceId = new ObjectId();
  cost = new Number();
  status = new PaymentStatuses();
  externalPaymentId = new String();
}
export class PaymentProviderResponse {
  paymentId = new String();
  amount = new Object();
  status = new String();
  orderId = new String();
  receiptUrl = new String();
}
