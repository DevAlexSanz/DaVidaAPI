import mongoose from 'mongoose';
import specialtyModel from './specialty.model.js';
import areaModel from '../area.model.js';

export const getAllSpecialties = async (request, response) => {
  try {
    const specialties = await specialtyModel.find().populate('area');

    return response.status(200).json({
      code: 200,
      specialties,
    });
  } catch (err) {
    console.log(err);

    return response.status(500).json({
      message: 'Internal server error',
      code: 500,
    });
  }
};

export const getSpecialtyById = async (request, response) => {
  const { id } = request.params;

  // ID format validation and ID exists validation
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  const specialtyExists = await specialtyModel.findById(id);

  if (!specialtyExists) {
    return response.status(404).json({
      message: 'The Specialty does not exist in the database',
      code: 404,
    });
  }

  try {
    const specialty = await specialtyModel.findById(id).populate('area');

    return response.status(200).json({
      message: 'Specialty was found!',
      code: 200,
      specialty,
    });
  } catch (err) {
    console.log(err);

    return response.status(500).json({
      message: 'Internal server error',
      code: 500,
    });
  }
};

export const createSpecialty = async (request, response) => {
  const { name, area } = request.body;

  // Fields validation (no empty fields)
  if (!name || !area) {
    return response.status(400).json({
      message: 'The fields name and Area are required',
      code: 400,
    });
  }

  // ID format validation and Area Exists validation
  if (!mongoose.Types.ObjectId.isValid(area)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  const areaExists = await areaModel.findById(area);

  if (!areaExists) {
    return response.status(404).json({
      message: 'The Area does not exist in the database',
      code: 404,
    });
  }

  // Area Active validation
  const areaActive = await areaModel.findOne({
    _id: area,
    status: true,
  });

  if (!areaActive) {
    return response.status(400).json({
      message: 'The Area is not active',
      code: 400,
    });
  }

  // Specialty already exists validation
  const specialtyExists = await specialtyModel.findOne({ area });

  if (specialtyExists) {
    return response.status(400).json({
      message: 'the Specialty already exists in the database',
      code: 400,
    });
  }

  try {
    const newSpecialty = await specialtyModel.create({
      name,
      area,
    });

    return response.status(201).json({
      message: 'Specialty created and stored successfully',
      code: 201,
      newSpecialty,
    });
  } catch (err) {
    console.log(err);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const updateSpecialty = async (request, response) => {
  const { id } = request.params;
  const payload = request.body;

  // ID format validation and ID exists validation
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  const specialty = await specialtyModel.findById(id);

  if (!specialty) {
    return response.status(404).json({
      message: 'The Specialty does not exist in the database',
      code: 404,
    });
  }

  // Payload validation (no empty fields)
  if (Object.keys(payload).length === 0) {
    return response.status(400).json({
      message: 'The payload is empty',
      code: 400,
    });
  }

  // Specialty already exists validation
  const { name } = payload;

  const specialtyExists = await specialtyModel.findOne({ name });

  if (specialtyExists) {
    return response.status(400).json({
      message: 'The Speciaty already exists in the database',
      code: 400,
    });
  }

  const { area } = payload;

  if (area) {
    // ID format validation and ID exists validation
    if (!mongoose.Types.ObjectId.isValid(area)) {
      return response.status(400).json({
        message: 'The ID format type entered is invalid',
        code: 400,
      });
    }

    const areaExists = await areaModel.findById(area);

    if (!areaExists) {
      return response.status(404).json({
        message: 'The Area does not exist in the database',
        code: 404,
      });
    }

    // Area Active validation
    const areaActive = await areaModel.findOne({
      _id: area,
      status: true,
    });

    if (!areaActive) {
      return response.status(400).json({
        message: 'The Area is not active',
        code: 400,
      });
    }
  }

  try {
    const specialtyUpdated = await specialtyModel.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
      }
    );

    return response.status(200).json({
      message: 'Specialty updated successfully',
      code: 200,
      specialtyUpdated,
    });
  } catch (err) {
    console.log(err);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const deleteSpecialty = async (request, response) => {
  const { id } = request.params;

  // ID format validation and ID exists validation
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  const specialty = await specialtyModel.findById(id);

  if (!specialty) {
    return response.status(404).json({
      code: 404,
      message: 'The Specialty does not exist in the database',
    });
  }

  try {
    await specialtyModel.findByIdAndDelete(id);

    return response.status(200).json({
      code: 200,
      message: 'Specialty deleted successfully',
    });
  } catch (err) {
    console.log(err);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};
