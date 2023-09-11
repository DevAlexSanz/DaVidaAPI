import mongoose from 'mongoose';
import areaModel from './area.model.js';

export const getAllAreas = async (request, response) => {
  try {
    const areas = await areaModel.find();

    return response.status(200).json({
      code: 200,
      areas,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const getAreaById = async (request, response) => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  const area = await areaModel.findById(id);

  if (!area) {
    return response.status(404).json({
      message: 'The Area does not exist in the database',
      code: 404,
    });
  }

  try {
    const area = await areaModel.findById(id);

    return response.status(200).json({
      message: 'Area was found!',
      code: 200,
      area,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const createArea = async (request, response) => {
  const { name } = request.body;

  // Name field validation (no empty field)
  if (!name) {
    return response.status(400).json({
      message: 'The field is required',
      code: 400,
    });
  }
  
  // Area already exists validation
  const areaExists = await areaModel.findOne({ name });

  if (areaExists) {
    return response.status(400).json({
      message: 'Area already exists!',
      code: 400,
    });
  }

  try {
    const newArea = await areaModel.create({
      name,
    });

    return response.status(201).json({
      message: 'Area created and stored successfully!',
      code: 201,
      newArea,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const updateArea = async (request, response) => {
  const { id } = request.params;
  const payload = request.body;

  // ID format validation and ID exists validation
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  const area = await areaModel.findById(id);

  if (!area) {
    return response.status(404).json({
      message: 'The Area does not exist in the database',
      code: 404,
    });
  }

  // Payload validation (no empty payload)
  if (Object.keys(payload).length === 0) {
    return response.status(400).json({
      message: 'The payload is empty',
      code: 400,
    });
  }

  // Area name already exists validation
  const { name } = payload;

  const areaExists = await areaModel.findOne({ name });

  if (areaExists) {
    return response.status(400).json({
      message: 'Area already exists!',
      code: 400,
    });
  }

  try {
    const areaUpdated = await areaModel.findByIdAndUpdate(id, payload, {
      new: true,
    });

    return response.status(200).json({
      message: 'Area updated successfully!',
      code: 200,
      areaUpdated,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const deleteArea = async (request, response) => {
  const { id } = request.params;

  // ID format validation and ID exists validation
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  const area = await areaModel.findById(id);

  if (!area) {
    return response.status(404).json({
      code: 404,
      message: 'The Area does not exist in the database',
    });
  }

  try {
    await areaModel.findByIdAndDelete(id);

    return response.status(200).json({
      code: 200,
      message: 'Area deleted successfully',
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};
