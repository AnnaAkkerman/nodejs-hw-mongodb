import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema, loginUserSchema } from '../validation/auth.js';
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  sendResetPasswordEmailController,
  resetPasswordController,
  getOAuthUrlController,
  verifyGoogleOAuthUrlController,
} from '../controllers/auth.js';
import { authenticate } from '../middlewares/authenticate.js';
import { sendResetPasswordEmailSchema } from '../validation/sendResetPasswordEmailSchema.js';
import { resetPasswordSchema } from '../validation/resetPasswordSchema.js';
import { validateGoogleOAuthSchema } from '../validation/validateGoogleOAuth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

authRouter.post(
  '/refresh',
  authenticate,
  ctrlWrapper(refreshUserSessionController),
);

authRouter.post('/logout', authenticate, ctrlWrapper(logoutUserController));

authRouter.post(
  '/send-reset-email',
  validateBody(sendResetPasswordEmailSchema),
  ctrlWrapper(sendResetPasswordEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

authRouter.post('/get-oauth-url', ctrlWrapper(getOAuthUrlController));

authRouter.post(
  '/verify-google-oauth',
  validateBody(validateGoogleOAuthSchema),
  ctrlWrapper(verifyGoogleOAuthUrlController),
);

export default authRouter;
