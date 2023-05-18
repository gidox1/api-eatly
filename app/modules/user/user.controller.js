class UserController {
  constructor(service, logger){
    this.service = service;
    this.logger = logger;
  }

  /**
   * @param {Req} req
   * @param {Res} res
   */
  async create(req, res) {
    console.log('reached controller');
    return true;
  }
}

module.exports = UserController;