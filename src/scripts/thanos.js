import { PATH_DB } from '../constants/contacts.js';
import fs from 'node:fs/promises';

export const thanos = async () => {
  try {
    const prevContacts = await fs.readFile(PATH_DB);
    const contacts = JSON.parse(prevContacts);
    const updatedContacts = contacts.filter((contact) => {
      return Math.random() < 0.51 > 0.5;
    });
    await fs.writeFile(PATH_DB, JSON.stringify(updatedContacts));
  } catch (err) {
    console.error('Помилка читання файлу:', err);
  }
};

await thanos();
