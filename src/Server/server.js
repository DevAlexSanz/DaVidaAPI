import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { enviromentConfig } from '../Config/config.js';
import { initializeDB } from '../Database/database.js';
import { setRoles, setAdmin } from '../Libs/initialSet.js';

const app = express();
const { url, port } = enviromentConfig;

const initializeServer = async (apiRoutes) => {
  try {
    await initializeDB();

    await setRoles();
    await setAdmin();

    app.set(port);

    // Middlewares
    app.use(express.json());

    app.use(cors());

    app.use(morgan('dev'));

    await app.listen(port, () => {
      console.log(
        '===========================================================\n' +
          `Server listening and running on port: ${url}${port}\n` +
          '===========================================================\n'
      );
    });

    app.use('/api', apiRoutes);

    app.get('/', (request, response) => {
      return response.status(200).json({
        message: 'Welcome to the API',
        api: `${url}${port}/api`,
      });
    });
  } catch (err) {
    console.error(err.message);
  }
};

export default initializeServer;
