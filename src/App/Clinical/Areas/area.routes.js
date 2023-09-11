import { Router } from 'express';
import {
  getAllAreas,
  getAreaById,
  createArea,
  updateArea,
  deleteArea,
} from './area.controller.js';

import { verifyAdminMiddleware } from '../../../Middlewares/Auth.js';

import specialtyModel from './Specialties/specialty.routes.js';

const router = Router();

router.use((request, response, next) => {
  response.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

router.use('/specialties', specialtyModel);

router.get('/', [verifyAdminMiddleware], getAllAreas);
router.get('/:id', [verifyAdminMiddleware], getAreaById);
router.post('/', [verifyAdminMiddleware], createArea);
router.put('/:id', [verifyAdminMiddleware], updateArea);
router.delete('/:id', [verifyAdminMiddleware], deleteArea);

export default router;
