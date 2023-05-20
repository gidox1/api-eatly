import logger from "./logger.js";
import { getAuth } from 'firebase-admin/auth';

export const getAuthToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const token = req.headers.authorization.split(' ')[1];
    return token;
  } else {
    return null;
  }
};

/**
 * @param {Request} req 
 * @param {Response} res 
 * @param {import("express").NextFunction} next 
 */
export async function authValidation (req, res, next) {
  const token = getAuthToken(req);
  try {
    const decoded = await getAuth().verifyIdToken(token);
    const claims = await (await getAuth().getUser(decoded.uid)).customClaims;
    req.user = {
      ...decoded,
      userId: claims.eatlyUserId,
    };
    next();
  } catch(error) {
    logger.log({ message: 'User not authorized to make this request' }, error);
    return res.status(401).send({
      error: true,
      message: 'User not authorized to make this request',
    });
  }
}