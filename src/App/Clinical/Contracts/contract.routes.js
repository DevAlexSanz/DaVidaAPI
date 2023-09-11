import { Router } from 'express';
import {
  getAllContract,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
} from './contract.controller.js';

import { verifyAdminMiddleware } from '../../../Middlewares/Auth.js';

const router = new Router();

router.use((request, response, next) => {
  response.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

router.get('/', [verifyAdminMiddleware], getAllContract);
router.get('/:id', [verifyAdminMiddleware], getContractById);
router.post('/', [verifyAdminMiddleware], createContract);
router.put('/:id', [verifyAdminMiddleware], updateContract);
router.delete('/:id', [verifyAdminMiddleware], deleteContract);

export default router;
