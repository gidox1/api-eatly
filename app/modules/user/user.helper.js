import { User } from "../../commands/user.command.js";

export const buildUserData = (data) => {
  const resp = {};
  const keys = Object.keys(data).filter((key) => {
    return key !== 'restaurantName'
  })

  for(let k of keys) {
    resp[k] = data[k];
  }
  return resp;
}

export const roles = {
  merchant: 'merchant',
  user: 'user'
} 

/**
 * @param {User} data 
 */
export const userResponseMapper = (data) => {
  delete data.password;
  return data;
}
