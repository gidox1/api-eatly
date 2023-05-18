
class UserService {
  constructor(logger, config, repository){
    this.logger = logger;
    this.config = config;
    this.repository = repository
  }

  /**
   * @param {UserRequest} user request Data
   */
  async create(data) {
    console.log('within service')
  }
}

module.exports = UserService;