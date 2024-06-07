import { Router } from 'express';
import {
  createContactController,
  deleteContactByIdController,
  getContactByIdController,
  getContactsController,
  patchContactByIdController,
  putContactByIdController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateMongoId } from '../middlewares/validateMongoId,js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema } from '../validation/createContactSchema.js';
import { updateContactSchema } from '../validation/updateContactSchema.js';

const contactsRouter = Router();

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get(
  '/contacts/:contactId',
  validateMongoId('contactId'),
  ctrlWrapper(getContactByIdController),
);

contactsRouter.post(
  '/contacts',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

contactsRouter.patch(
  '/contacts/:contactId',
  validateMongoId('contactId'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactByIdController),
);

contactsRouter.put(
  '/contacts/:contactId',
  validateBody(createContactSchema),
  validateMongoId('contactId'),
  ctrlWrapper(putContactByIdController),
);

contactsRouter.delete(
  '/contacts/:contactId',
  validateMongoId('contactId'),
  ctrlWrapper(deleteContactByIdController),
);

export default contactsRouter;
