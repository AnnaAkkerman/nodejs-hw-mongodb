import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Set name for user',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Set email for user',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Set password for user',
  }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
