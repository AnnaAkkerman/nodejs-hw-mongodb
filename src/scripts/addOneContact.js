import { PATH_DB } from '../constants/contacts.js';
import { createFakeContact } from '../utils/createFakeContact.js';
import fs from 'node:fs/promises';

export const addOneContact = async () => {
  try {
    const prevContacts = await fs.readFile(PATH_DB);
    const contacts = JSON.parse(prevContacts);
    contacts.push(createFakeContact());

    await fs.writeFile(PATH_DB, JSON.stringify(contacts));
  } catch (err) {
    console.error('Помилка читання файлу:', err);
  }
};

await addOneContact();
