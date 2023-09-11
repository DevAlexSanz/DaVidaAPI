import jwt from 'jsonwebtoken';
import adminModel from './admin.model.js';
import { enviromentConfig } from '../../../../Config/config.js';

const { tokenSecret } = enviromentConfig;

export const signIn = async (request, response) => {
  const { email, password } = request.body;

  const adminExists = await adminModel.findOne({ email }).populate('role');

  if (!adminExists) {
    return response.status(400).json({
      message: 'Admin not found',
      code: 400,
    });
  }

  const matchPassword = await adminModel.comparePassword(
    password,
    adminExists.password
  );

  if (!matchPassword) {
    return response.status(401).json({
      message: 'Invalid password',
      code: 401,
    });
  }

  try {
    const token = jwt.sign({ id: adminExists._id }, tokenSecret, {
      expiresIn: 86400,
    });

    return response.status(200).json({
      message: 'Admin logged successfully',
      code: 200,
      token,
    });
  } catch (err) {
    console.err(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};
