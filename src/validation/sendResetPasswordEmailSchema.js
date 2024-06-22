import Joi from 'joi';

export const sendResetPasswordEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
