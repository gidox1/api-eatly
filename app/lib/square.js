import {Client, Environment, ApiError} from 'square';

export default new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox,
});
