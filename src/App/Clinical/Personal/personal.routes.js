import { Router } from 'express';
import { enviromentConfig } from '../../../Config/config.js';

const { url, port } = enviromentConfig;

//Admin routes
import adminRoute from './Administrator/admin.routes.js';
// Doctor routes
import doctorRoutes from './Doctors/doctor.routes.js';
// Nurse routes
import nurseRoutes from './Nurses/nurse.routes.js';

const router = Router();

router.use('/admin', adminRoute);
router.use('/doctors', doctorRoutes);
router.use('/nurses', nurseRoutes);

router.get('/', (request, response) => {
  return response.status(200).json({
    admin: `${url}${port}/api/clinical/personal/admin`,
    doctors: `${url}${port}/api/clinical/personal/doctors`,
    nurses: `${url}${port}/api/clinical/personal/nurses`,
  });
});

export default router;
