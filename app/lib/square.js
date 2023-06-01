import {Client, Environment, ApiError} from 'square';
import config from '../config.js';

export default new Client({
  accessToken: config.square.accessToken,
  environment: Environment.Sandbox,
});
