import { PATH_DB } from '../constants/contacts.js';
import fs from 'node:fs/promises';

export const removeAllContacts = async () => {
  try {
    const arr = [];
    await fs.writeFile(PATH_DB, JSON.stringify(arr));
  } catch (err) {
    console.error('Помилка читання файлу:', err);
  }
};

await removeAllContacts();
