import { Router } from 'express';
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} from './patient.controller.js';

import { verifyAllMiddleware } from '../../../Middlewares/Auth.js';

const router = Router();

router.use((request, response, next) => {
  response.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

router.get('/', [verifyAllMiddleware], getAllPatients);
router.get('/:id', [verifyAllMiddleware], getPatientById);
router.post('/', [verifyAllMiddleware], createPatient);
router.put('/:id', [verifyAllMiddleware], updatePatient);
router.delete('/:id', [verifyAllMiddleware], deletePatient);

export default router;
