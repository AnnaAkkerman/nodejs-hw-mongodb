import createHttpError from 'http-errors';
import { Contact } from '../db/contact.js';
import { saveFile } from '../utils/saveFile.js';

const createPaginationInformation = (page, perPage, count) => {
  const totalPages = Math.ceil(count / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    page,
    perPage,
    totalItems: count,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filter = {},
  userId,
}) => {
  const skip = perPage * (page - 1);

  const contactsFilters = Contact.find();

  if (filter.isFavourite) {
    contactsFilters.where('isFavourite').equals(filter.isFavourite);
  }
  if (filter.type) {
    contactsFilters.where('contactType').equals(filter.type);
  }

  contactsFilters.where('userId').equals(userId);

  const [contactsCount, data] = await Promise.all([
    Contact.find().merge(contactsFilters).countDocuments(),
    Contact.find()
      .merge(contactsFilters)
      .skip(skip)
      .limit(perPage)
      .sort({
        [sortBy]: sortOrder,
      })
      .exec(),
  ]);

  const paginationInformation = createPaginationInformation(
    page,
    perPage,
    contactsCount,
  );

  return {
    data,
    ...paginationInformation,
  };
};

export const getContactById = async (authContactId) => {
  const contact = await Contact.findOne(authContactId);
  if (!contact) {
    throw createHttpError(404, {
      status: 404,
      message: 'Contact not found',
      data: { message: 'Contact not found' },
    });
  }

  return contact;
};

export const createContact = async ({ avatar, ...payload }, userId) => {
  const url = await saveFile(avatar);

  const contact = await Contact.create({
    ...payload,
    parentId: userId,
    photo: url,
  });

  return contact;
};

export const upsertContact = async (
  authContactId,
  { avatar, ...payload },
  options = {},
) => {
  const url = avatar ? await saveFile(avatar) : null;

  const update = {
    ...payload,
    ...(url && { photo: url }),
  };

  const rawResult = await Contact.findOneAndUpdate(authContactId, update, {
    new: true,
    ...options,
  });

  if (!rawResult) {
    throw createHttpError(404, {
      status: 404,
      message: 'Contact not found',
      data: { message: 'Contact not found' },
    });
  }

  return {
    contact: rawResult,
    isNew: !rawResult?.lastErrorObject?.updatedExisting,
  };
};

export const deleteContactById = async (authContactId) => {
  await Contact.findOneAndDelete(authContactId);
  if (!authContactId) {
    throw createHttpError(404, {
      status: 404,
      message: 'Contact not found',
      data: { message: 'Contact not found' },
    });
  }
};
