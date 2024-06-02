import {
  createContact,
  deleteContactById,
  getAllContacts,
  getContactById,
  upsertContact,
} from '../services/contacts.js';

export const getContactsController = async (req, res, next) => {
  const contacts = await getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  res.json({
    status: 200,
    data: contact,
    message: `Successfully found contact with id ${contactId}!`,
  });
};

export const createContactController = async (req, res, next) => {
  const { body } = req;
  const contact = await createContact(body);
  res.status(201).json({
    status: 201,
    data: contact,
    message: 'Successfully created a contact!',
  });
};

export const patchContactByIdController = async (req, res, next) => {
  const { body } = req;
  const { contactId } = req.params;
  const { contact } = await upsertContact(contactId, body);
  res.json({
    status: 200,
    data: contact,
    message: 'Successfully patched a contact!',
  });
};

export const putContactByIdController = async (req, res, next) => {
  const { body } = req;
  const { contactId } = req.params;
  const { isNew, contact } = await upsertContact(contactId, body, {
    upsert: true,
  });
  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    data: contact,
    message: `Successfully upserted contact!`,
  });
};

export const deleteContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  await deleteContactById(contactId);

  res.status(204).send();
};
