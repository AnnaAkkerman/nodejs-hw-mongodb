import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';
import { createFolderIfDoesNotExist } from './utils/createFolderIfDoesNotExist.js';

const bootstrap = async () => {
  await initMongoConnection();
  await createFolderIfDoesNotExist(TEMP_UPLOAD_DIR);
  await createFolderIfDoesNotExist(UPLOAD_DIR);

  setupServer();
};

bootstrap();
