import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import Handlebars from 'handlebars';
import fs from 'node:fs/promises';
import path from 'node:path';

import { UsersCollection } from '../db/user.js';
import { SessionsCollection } from '../db/session.js';
import { env } from '../utils/env.js';
import { sendMail } from '../utils/sendMail.js';
import { deleteSession } from '../utils/deleteSession.js';
import { validateGoogleOAuthCode } from '../utils/googleOAuth.js';

export const registerUser = async (payload) => {
  const existingUser = await UsersCollection.findOne({ email: payload.email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + 1000 * 60 * 15,
    refreshTokenValidUntil: Date.now() + 1000 * 60 * 60 * 24 * 7,
  };
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  await SessionsCollection.deleteOne({ _id: sessionId });

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const sendResetPassword = async (email) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const templateSource = await fs.readFile(
    path.join('src', 'templates', 'send-reset-password-email.html'),
  );

  const template = Handlebars.compile(templateSource.toString());

  const html = template({
    name: user.name,
    link: `${env('FRONTEND_HOST')}/reset-password?token=${token}`,
  });

  try {
    await sendMail({
      html,
      to: email,
      from: env('SMTP_FROM'),
      subject: 'Reset password',
    });
  } catch (err) {
    console.log(err);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async ({ token, password }) => {
  let tokenPayload;

  try {
    tokenPayload = jwt.verify(token, env('JWT_SECRET'));
  } catch (err) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await UsersCollection.findOne({
    email: tokenPayload.email,
    _id: tokenPayload.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await UsersCollection.findOneAndUpdate(
    {
      _id: tokenPayload.sub,
      email: tokenPayload.email,
    },
    { password: hashedPassword },
  );
  await deleteSession(tokenPayload.sub);
};

export const loginOrSignupWithGoogleOAuth = async (code) => {
  const payload = await validateGoogleOAuthCode(code);
  if (!payload) createHttpError(401);

  let user = await UsersCollection.findOne({
    email: payload.email,
  });
  if (!user) {
    const hasedPassword = await bcrypt.hash(
      randomBytes(30).toString('base64'),
      10,
    );
    user = await UsersCollection.create({
      name: payload.given_name + ' ' + payload.family_name,
      password: hasedPassword,
      email: payload.email,
    });
  }

  await SessionsCollection.deleteOne({
    userId: user._id,
  });

  return await SessionsCollection.create({
    userId: user._id,
    ...createSession(),
  });
};
