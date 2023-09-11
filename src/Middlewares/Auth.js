import jwt from 'jsonwebtoken';
import adminModel from '../App/Clinical/Personal/Administrator/admin.model.js';
import nurseModel from '../App/Clinical/Personal/Nurses/nurse.model.js';
import doctorModel from '../App/Clinical/Personal/Doctors/doctor.model.js';
import { enviromentConfig } from '../Config/config.js';

const { tokenSecret } = enviromentConfig;

export const verifyAdminMiddleware = async (request, response, next) => {
  let token = request.headers['x-access-token'];

  if (!token) {
    return response.status(403).json({
      message: 'No token provided',
      code: 403,
    });
  }

  try {
    const decoded = jwt.verify(token, tokenSecret);

    request.id = decoded.id;

    const admin = await adminModel.findById(request.id).populate('role');

    if (!admin) {
      return response.status(404).json({
        message: 'No Admin found',
        code: 404,
      });
    }

    const role = admin.role.name;

    if (role !== 'admin') {
      return response.status(403).json({
        message: 'Require Admin Role!',
        code: 403,
      });
    }

    next();
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal server error or invalid token (Expired)',
      code: 500,
    });
  }
};

export const verifyDoctorMiddleware = async (request, response, next) => {
  let token = request.headers['x-access-token'];

  if (!token) {
    return response.status(403).json({
      message: 'No token provided',
      code: 403,
    });
  }

  try {
    const decoded = jwt.verify(token, tokenSecret);

    request.id = decoded.id;

    const doctor = await doctorModel.findById(request.id).populate('role');

    if (!doctor) {
      return response.status(404).json({
        message: 'No Doctor found',
        code: 404,
      });
    }

    const role = doctor.role.name;

    if (role !== 'doctor') {
      return response.status(403).json({
        message: 'Require Doctor Role!',
        code: 403,
      });
    }

    next();
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal server error or invalid token (Expired)',
      code: 500,
    });
  }
};

export const verifyNurseMiddleware = async (request, response, next) => {
  let token = request.headers['x-access-token'];

  if (!token) {
    return response.status(403).json({
      message: 'No token provided',
      code: 403,
    });
  }

  try {
    const decoded = jwt.verify(token, tokenSecret);

    request.id = decoded.id;

    const nurse = await nurseModel.findById(request.id).populate('role');

    if (!nurse) {
      return response.status(404).json({
        message: 'No Nurse found',
        code: 404,
      });
    }

    const role = nurse.role.name;

    if (role !== 'nurse') {
      return response.status(403).json({
        message: 'Require Nurse Role!',
        code: 403,
      });
    }

    next();
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal server error or invalid token (Expired)',
      code: 500,
    });
  }
};

export const verifyAllMiddleware = async (request, response, next) => {
  let token = request.headers['x-access-token'];

  if (!token) {
    return response.status(403).json({
      message: 'No token provided',
      code: 403,
    });
  }

  try {
    const decoded = jwt.verify(token, tokenSecret);

    request.id = decoded.id;

    const admin = await adminModel.findById(request.id).populate('role');
    const doctor = await doctorModel.findById(request.id).populate('role');
    const nurse = await nurseModel.findById(request.id).populate('role');

    if (!admin && !doctor && !nurse) {
      return response.status(404).json({
        message: 'No User found',
        code: 404,
      });
    }

    const roleAdmin = admin && admin.role.name;
    const roleDoctor = doctor && doctor.role.name;
    const roleNurse = nurse && nurse.role.name;

    if (
      roleAdmin !== 'admin' &&
      roleDoctor !== 'doctor' &&
      roleNurse !== 'nurse'
    ) {
      return response.status(403).json({
        message: 'Require Admin, Doctor or Nurse Role!',
        code: 403,
      });
    }

    next();
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal server error or invalid token (Expired)',
      code: 500,
    });
  }
};
