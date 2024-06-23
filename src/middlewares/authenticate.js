import createHttpError from 'http-errors';

import { SessionsCollection } from '../db/session.js';
import { UsersCollection } from '../db/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  const session = await SessionsCollection.findOne({ accessToken: token });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  if (Date.now() > session.accessTokenValidUntil) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await UsersCollection.findOne({ _id: session.userId });

  if (!user) {
    return next(createHttpError(401));
  }

  req.user = user;

  return next();
};
