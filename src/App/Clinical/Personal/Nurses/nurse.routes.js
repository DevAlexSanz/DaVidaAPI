import { Router } from 'express';
import {
  signIn,
  getAllNurses,
  getNurseById,
  createNurse,
  updateNurse,
  deleteNurse,
} from './nurse.controller.js';

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
router.get('/', [verifyAdminMiddleware], getAllNurses);
router.get('/:id', [verifyAdminMiddleware], getNurseById);
router.post('/', [verifyAdminMiddleware], createNurse);
router.put('/:id', [verifyAdminMiddleware], updateNurse);
router.delete('/:id', [verifyAdminMiddleware], deleteNurse);

export default router;
