import mongoose from 'mongoose';
import roleModel from './role.model.js';

export const getAllRoles = async (request, response) => {
  try {
    const roles = await roleModel.find();

    return response.status(200).json({
      code: 200,
      roles,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const getRoleById = async (request, response) => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  try {
    const role = await roleModel.findById(id);

    if (!role) {
      return response.status(404).json({
        message: 'The role does not exist in the database',
        code: 404,
      });
    }

    return response.status(200).json({
      message: 'Role was found!',
      code: 200,
      role,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Server Internal Error',
      code: 500,
    });
  }
};

export const createRole = async (request, response) => {
  const { name } = request.body;

  if (!name) {
    return response.status(400).json({
      message: 'the field name are required!',
      code: 400,
    });
  }

  try {
    const existingRole = await roleModel.findOne({ name });

    if (existingRole) {
      return response.status(400).json({
        message: 'Role already exists!',
        code: 400,
      });
    }

    const newRole = await roleModel.create({
      name,
    });

    return response.status(201).json({
      message: 'Role created and stored successfully!',
      code: 201,
      newRole,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Server Internal Error',
      code: 500,
    });
  }
};

export const updateRole = async (request, response) => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  const payload = request.body;

  if (Object.keys(payload).length === 0) {
    return response.status(400).json({
      message: 'The payload is empty',
      code: 400,
    });
  }
  const { name } = payload;

  const existsRole = await roleModel.findOne({ name });

  if (existsRole) {
    return response.status(400).json({
      message: 'Role already exists!',
      code: 400,
    });
  }

  const role = await roleModel.findById(id);

  if (!role) {
    return response.status(404).json({
      message: 'The role does not exist in the database',
      code: 404,
    });
  }

  try {
    const roleUpdated = await roleModel.findByIdAndUpdate(id, payload, {
      new: true,
    });

    return response.status(200).json({
      message: 'Role updated successfully!',
      code: 200,
      roleUpdated,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const deleteRole = async (request, response) => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  try {
    const role = await roleModel.findById(id);

    if (!role) {
      return response.status(404).json({
        code: 404,
        message: 'The role does not exist in the database',
      });
    }

    await roleModel.findByIdAndDelete(id);

    return response.status(200).json({
      code: 200,
      message: 'Role deleted successfully',
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};
