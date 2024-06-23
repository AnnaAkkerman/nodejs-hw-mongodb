import { SessionsCollection } from '../db/session.js';

export const deleteSession = async (userId) => {
  await SessionsCollection.findOneAndDelete({ userId });
};
