import { Logger } from "../../commands/logger.command.js";


class PaymentController {
  /**
   * @param {*} service 
   * @param {Logger} logger 
   */
  constructor(service, logger) {
    this.service = service;
    this.logger = logger;
  }

  async list() {

  }
}

export default PaymentController;