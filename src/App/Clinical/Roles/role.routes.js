import { Router } from 'express';
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from './role.controller.js';

import { verifyAdminMiddleware } from '../../../Middlewares/Auth.js';

const router = new Router();

router.use((request, response, next) => {
  response.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

router.get('/', [verifyAdminMiddleware], getAllRoles);
router.get('/:id', [verifyAdminMiddleware], getRoleById);
router.post('/', [verifyAdminMiddleware], createRole);
router.put('/:id', [verifyAdminMiddleware], updateRole);
router.delete('/:id', [verifyAdminMiddleware], deleteRole);

export default router;
