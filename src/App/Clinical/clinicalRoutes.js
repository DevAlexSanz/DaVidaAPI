import { Router } from 'express';
import { enviromentConfig } from '../../Config/config.js';

// Areas and Categories routes
import areaRoutes from './Areas/area.routes.js';
// Contracts routes
import contractRoutes from './Contracts/contract.routes.js';
// Roles routes
import roleRoutes from './Roles/role.routes.js';
// Administrator, Doctors and Nurses routes
import personalRoutes from './Personal/personal.routes.js';
// Patients routes
import patientRoutes from './Patients/patient.routes.js';

const router = Router();

const { url, port } = enviromentConfig;

router.use('/areas', areaRoutes);
router.use('/contracts', contractRoutes);
router.use('/roles', roleRoutes);
router.use('/personal', personalRoutes);
router.use('/patients', patientRoutes);

router.get('/', (request, response) => {
  return response.status(200).json({
    AreasAndCategories: `${url}${port}/api/clinical/areas`,
    Contracts: `${url}${port}/api/clinical/contracts`,
    Roles: `${url}${port}/api/clinical/roles`,
    Personal: `${url}${port}/api/clinical/personal`,
    Patients: `${url}${port}/api/clinical/patients`,
  });
});

export default router;
