import Joi from 'joi';

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(20),
  phoneNumber: Joi.string().min(2).max(20),
  email: Joi.string().optional(true).min(2).max(20),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .default('personal')
    .min(2)
    .max(20),
});
