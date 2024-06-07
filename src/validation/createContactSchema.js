import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(3).max(20).messages({
    'string.min': 'Min srting length is noy achieved',
    'any.required': 'Must be required!',
  }),
  phoneNumber: Joi.string().required().min(3).max(20),
  email: Joi.string().optional(true).min(3).max(20) || null,
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()
    .required()
    .valid('work', 'home', 'personal')
    .default('personal')
    .min(3)
    .max(20),
});
