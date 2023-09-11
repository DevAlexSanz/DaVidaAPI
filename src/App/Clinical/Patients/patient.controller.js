import mongoose from 'mongoose';
import patientModel from './patient.model.js';

export const getAllPatients = async (request, response) => {
  try {
    const patients = await patientModel.find();

    return response.status(200).json({
      code: 200,
      patients,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const getPatientById = async (request, response) => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  try {
    const patient = await patientModel.findById(id);

    if (!patient) {
      return response.status(404).json({
        message: 'The patient does not exist in the database',
        code: 404,
      });
    }

    return response.status(200).json({
      message: 'Patient was found!',
      code: 200,
      patient,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const createPatient = async (request, response) => {
  const {
    name: { firstName, lastName },
    age,
    gender,
    address: { municipio, departamento },
    numberPhone,
    email,
  } = request.body;

  if (
    !firstName ||
    !lastName ||
    !age ||
    !gender ||
    !municipio ||
    !departamento ||
    !numberPhone ||
    !email
  ) {
    return response.status(400).json({
      message:
        'The fields fullname, age, gender, address, numberPhone and email are required',
      code: 400,
    });
  }

  try {
    const existingEmail = await patientModel.findOne({ email });
    const existingPhone = await patientModel.findOne({ numberPhone });

    if (existingEmail || existingPhone) {
      return response.status(409).json({
        message:
          'Email or Number Phone already exists. Please enter a different email',
        code: 409,
      });
    }

    const newPatient = await patientModel.create({
      name: { firstName, lastName },
      age,
      gender,
      address: { municipio, departamento },
      numberPhone,
      email,
    });

    return response.status(201).json({
      message: 'Patient created and stored successfully',
      code: 201,
      newPatient,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const updatePatient = async (request, response) => {
  const { id } = request.params;
  const payload = request.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  try {
    const patient = await patientModel.findById(id);

    if (!patient) {
      return response.status(404).json({
        message: 'The patient does not exist in the database',
        code: 404,
      });
    }

    if (Object.keys(payload).length === 0) {
      return response.status(400).json({
        message: 'The payload is empty',
        code: 400,
      });
    }

    const patientUpdated = await patientModel.findByIdAndUpdate(id, payload, {
      new: true,
    });

    return response.status(200).json({
      message: 'Patient updated successfully',
      code: 200,
      patientUpdated,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const deletePatient = async (request, response) => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  try {
    const patient = await patientModel.findById(id);

    if (!patient) {
      return response.status(404).json({
        code: 404,
        message: 'The patient does not exist in the database',
      });
    }

    await patientModel.findByIdAndDelete(id);

    return response.status(200).json({
      code: 200,
      message: 'Patient deleted successfully',
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};
