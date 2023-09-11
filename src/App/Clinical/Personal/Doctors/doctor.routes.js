import { Router } from 'express';
import {
  signIn,
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from './doctor.controller.js';

import { verifyAdminMiddleware } from '../../../../Middlewares/Auth.js';

const router = Router();

router.use((request, response, next) => {
  response.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

router.post('/signin', signIn);
router.get('/', [verifyAdminMiddleware], getAllDoctors);
router.get('/:id', [verifyAdminMiddleware], getDoctorById);
router.post('/', [verifyAdminMiddleware], createDoctor);
router.put('/:id', [verifyAdminMiddleware], updateDoctor);
router.delete('/:id', [verifyAdminMiddleware], deleteDoctor);

export default router;
