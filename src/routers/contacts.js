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
import { validateMongoId } from '../middlewares/validateMongoId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema } from '../validation/createContactSchema.js';
import { updateContactSchema } from '../validation/updateContactSchema.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

// contactsRouter.use('/:contactId', validateMongoId('contactId'));

contactsRouter.get('/', authenticate, ctrlWrapper(getContactsController));

contactsRouter.get(
  '/:contactId',
  authenticate,
  validateMongoId('contactId'),
  ctrlWrapper(getContactByIdController),
);

contactsRouter.post(
  '/',
  upload.single('avatar'),
  authenticate,
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

contactsRouter.patch(
  '/:contactId',
  upload.single('avatar'),
  authenticate,
  validateMongoId('contactId'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactByIdController),
);

contactsRouter.put(
  '/:contactId',
  upload.single('avatar'),
  authenticate,
  validateBody(createContactSchema),
  validateMongoId('contactId'),
  ctrlWrapper(putContactByIdController),
);

contactsRouter.delete(
  '/contacts/:contactId',
  authenticate,
  validateMongoId('contactId'),
  ctrlWrapper(deleteContactByIdController),
);

export default contactsRouter;
