import { Router } from 'express';
import { enviromentConfig } from '../Config/config.js';
import clinicalRoutes from '../App/Clinical/clinicalRoutes.js';

const { url, port } = enviromentConfig;

const router = Router();

router.use('/clinical', clinicalRoutes);

router.get('/', (request, response) => {
  return response.status(200).json({
    message: 'Welcome to the /api',
    Clinical: `visit this route: ${url}${port}/api/clinical`,
  });
});

export default router;
