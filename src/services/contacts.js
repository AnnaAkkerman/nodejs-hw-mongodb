import createHttpError from 'http-errors';
import { Contact } from '../db/contact.js';
import { SchemaTypeOptions } from 'mongoose';

export const getAllContacts = async () => {
  // throw new Error('some error');
  const contacts = await Contact.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw createHttpError(404, {
      status: 404,
      message: 'Contact not found',
      data: { message: 'Contact not found' },
    });
  }

  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);

  return contact;
};

export const upsertContact = async (contactId, payload, options = {}) => {
  const rawResult = await Contact.findByIdAndUpdate(contactId, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  if (!rawResult || !rawResult.value) {
    throw createHttpError(404, {
      status: 404,
      message: 'Contact not found',
      data: { message: 'Contact not found' },
    });
  }

  return {
    contact: rawResult.value,
    isNew: !rawResult?.lastErrorObject?.updatedExisting,
  };
};

export const deleteContactById = async (contactId) => {
  const contact = await Contact.findByIdAndDelete(contactId);
  if (!contact) {
    throw createHttpError(404, {
      status: 404,
      message: 'Contact not found',
      data: { message: 'Contact not found' },
    });
  }
};
