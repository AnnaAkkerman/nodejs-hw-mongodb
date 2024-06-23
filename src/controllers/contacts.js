import {
  createContact,
  deleteContactById,
  getAllContacts,
  getContactById,
  upsertContact,
} from '../services/contacts.js';
import { parseFilters } from '../utils/parseFilters.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';

export const getContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = req.query;

  const filter = parseFilters(req.query);

  const contacts = await getAllContacts({
    userId: req.user._id,
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

const setAuthContactId = (req) => {
  let authContactId = {};
  const { contactId } = req.params;
  const userId = req.user._id;
  if (contactId) {
    authContactId = { _id: contactId, userId };
  }
  return authContactId;
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const authContactId = setAuthContactId(req);
    const contact = await getContactById(authContactId);

    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
        data: { message: 'Contact not found' },
      });
    }

    res.json({
      status: 200,
      data: contact,
      message: `Successfully found contact with id ${req.params.contactId}!`,
    });
  } catch (error) {
    next(error);
  }
};

export const createContactController = async (req, res, next) => {
  const contact = await createContact({
    userId: req.user._id,
    ...req.body,
    avatar: req.file,
  });
  res.status(201).json({
    status: 201,
    data: contact,
    message: 'Successfully created a contact!',
  });
};

export const patchContactByIdController = async (req, res, next) => {
  const { body, file } = req;
  const authContactId = setAuthContactId(req);
  // const { contactId } = req.params;
  const { contact } = await upsertContact(authContactId, {
    ...body,
    avatar: file,
  });
  res.json({
    status: 200,
    data: contact,
    message: 'Successfully patched a contact!',
  });
};

export const putContactByIdController = async (req, res, next) => {
  const { body, file } = req;
  const authContactId = setAuthContactId(req);
  // const { contactId } = req.params;
  const { isNew, contact } = await upsertContact(
    authContactId,
    {
      ...body,
      avatar: file,
    },
    {
      upsert: true,
    },
  );
  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    data: contact,
    message: `Successfully upserted contact!`,
  });
};

export const deleteContactByIdController = async (req, res, next) => {
  // const { contactId } = req.params;
  const authContactId = setAuthContactId(req);
  await deleteContactById(authContactId);

  res.status(204).send();
};
