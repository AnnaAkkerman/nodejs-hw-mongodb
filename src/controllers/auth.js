import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
  sendResetPassword,
  resetPassword,
  loginOrSignupWithGoogleOAuth,
} from '../services/auth.js';
import { generateOAuthURL } from '../utils/googleOAuth.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.json({
    status: 200,
    message: 'Successfully registered a user!',
    data: user,
  });
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: 7 * 24 * 60 * 60,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: 7 * 24 * 60 * 60,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);
  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });
  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');
  res.status(204).send();
};

export const sendResetPasswordEmailController = async (req, res) => {
  await sendResetPassword(req.body.email);
  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};

export const getOAuthUrlController = async (req, res) => {
  const url = generateOAuthURL();

  res.json({
    status: 200,
    message: 'OAuth URL generated successfully.',
    data: {
      url,
    },
  });
};

export const verifyGoogleOAuthUrlController = async (req, res) => {
  const { code } = req.body;
  const session = await loginOrSignupWithGoogleOAuth(code);

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Logged in with Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
