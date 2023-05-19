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
