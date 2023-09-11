import { Router } from 'express';
import {
  getAllSpecialties,
  getSpecialtyById,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
} from './specialty.controller.js';

import { verifyAdminMiddleware } from '../../../../Middlewares/Auth.js';

const router = Router();

router.use((request, response, next) => {
  response.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

router.get('/', [verifyAdminMiddleware], getAllSpecialties);
router.get('/:id', [verifyAdminMiddleware], getSpecialtyById);
router.post('/', [verifyAdminMiddleware], createSpecialty);
router.put('/:id', [verifyAdminMiddleware], updateSpecialty);
router.delete('/:id', [verifyAdminMiddleware], deleteSpecialty);

export default router;
