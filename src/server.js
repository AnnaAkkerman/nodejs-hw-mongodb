import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './services/contacts.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res, next) => {
    try {
      const contacts = await getAllContacts();
      res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (err) {
      next(err);
    }
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    try {
      const contact = await getContactById(contactId);
      if (!contact) {
        return res.json({
          status: 404,
          message: `Contact with id ${contactId} not found!`,
        });
      }

      res.json({
        status: 200,
        data: contact,
        message: `Successfully found contact with id ${contactId}!`,
      });
    } catch (err) {
      next(err);
    }
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Contacts not found!',
    });
  });

  app.use((err, req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
