import { Router } from 'express';
import { signIn } from './admin.controller.js';

const router = Router();

router.use((request, response, next) => {
  response.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

router.post('/signin', signIn);

export default router;
