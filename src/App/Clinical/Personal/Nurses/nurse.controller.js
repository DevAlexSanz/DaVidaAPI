import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import nurseModel from './nurse.model.js';
import { enviromentConfig } from '../../../../Config/config.js';

// Validation helpers
import patientModel from '../../Patients/patient.model.js';
import doctorModel from '../Doctors/doctor.model.js';
import roleModel from '../../Roles/role.model.js';
import contractModel from '../../Contracts/contract.model.js';
import specialtyModel from '../../Areas/Specialties/specialty.model.js';

const { tokenSecret } = enviromentConfig;

export const signIn = async (request, response) => {
  const { email, password } = request.body;

  //  Doctor exists in database validation
  const nurseExists = await nurseModel.findOne({ email }).populate('role');

  if (!nurseExists) {
    return response.status(400).json({
      message: 'Nurse not found',
      code: 400,
    });
  }

  // compare password validation
  const matchPassword = await nurseModel.comparePassword(
    password,
    nurseExists.password
  );

  if (!matchPassword) {
    return response.status(401).json({
      message: 'Invalid password',
      code: 401,
    });
  }

  try {
    const token = jwt.sign({ id: nurseExists._id }, tokenSecret, {
      expiresIn: 86400,
    });

    return response.status(200).json({
      message: 'Nurse logged successfully',
      code: 200,
      token,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const getAllNurses = async (request, response) => {
  try {
    const nurses = await nurseModel
      .find()
      .populate(['specialties', 'contract', 'role']);

    return response.status(200).json({
      code: 200,
      nurses,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const getNurseById = async (request, response) => {
  const { id } = request.params;

  // ID format validation and ID exists validation
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  try {
    const nurse = await nurseModel
      .findById(id)
      .populate(['specialties', 'contract', 'role']);

    if (!nurse) {
      return response.status(404).json({
        message: 'The nurse does not exist in the database',
        code: 404,
      });
    }

    return response.status(200).json({
      message: 'Nurse was found!',
      code: 200,
      nurse,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const createNurse = async (request, response) => {
  const {
    name: { firstName, lastName },
    age,
    gender,
    specialties,
    address: { municipality, departament },
    numberPhone,
    email,
    password,
    contract,
    role,
  } = request.body;

  // Fields validation (no empty fields)
  if (
    !firstName ||
    !lastName ||
    !age ||
    !gender ||
    !specialties ||
    !municipality ||
    !departament ||
    !numberPhone ||
    !email ||
    !password ||
    !contract ||
    !role
  ) {
    return response.status(400).json({
      message:
        'The fields fullname, age, gender, specialties, address, numberPhone, email, contract and role are required',
      code: 400,
    });
  }

  // Email and Number Phone already exists validation
  const emailExists =
    (await nurseModel.findOne({ email })) &&
    patientModel.findOne({ email }) &&
    doctorModel.findOne({ email });
  const phoneExists =
    (await nurseModel.findOne({ numberPhone })) &&
    patientModel.findOne({ numberPhone }) &&
    doctorModel.findOne({ numberPhone });

  if (emailExists || phoneExists) {
    return response.status(409).json({
      message:
        'Email or Number Phone already exists. Please enter a different email',
      code: 409,
    });
  }

  // Specialties: ID format validation, Exists validation and active validation
  if (
    !specialties.every((idEspecialty) =>
      mongoose.Types.ObjectId.isValid(idEspecialty)
    )
  ) {
    return response.status(400).json({
      message: 'One or more of the entered ID formats are invalid',
      code: 400,
    });
  }

  const specialtyPromises = specialties.map((idEspecialty) =>
    specialtyModel.findById(idEspecialty)
  );
  const specialtiesExists = await Promise.all(specialtyPromises);

  if (specialtiesExists.some((specialty) => !specialty)) {
    return response.status(404).json({
      message: 'One or more of the Specialties do not exist in the database',
      code: 404,
    });
  }

  const activePromises = specialties.map((specialtyId) =>
    specialtyModel.findOne({ _id: specialtyId, status: true })
  );

  const specialtiesActive = await Promise.all(activePromises);

  if (specialtiesActive.some((specialty) => !specialty)) {
    return response.status(400).json({
      message: 'One or more of the Specialties is not active',
      code: 400,
    });
  }

  // Contract: ID format validation, Exists validation and active validation
  if (!mongoose.Types.ObjectId.isValid(contract)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  const contractExists = await contractModel.findById(contract);

  if (!contractExists) {
    return response.status(404).json({
      message: 'The Contract does not exist in the database',
      code: 404,
    });
  }

  const contractActive = await contractModel.findOne({
    _id: contract,
    status: true,
  });

  if (!contractActive) {
    return response.status(400).json({
      message: 'The Contract is not active',
      code: 400,
    });
  }

  // Role: ID format validation and Exists validation
  if (!mongoose.Types.ObjectId.isValid(contract)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  const roleExists = await roleModel.findById(role);

  if (!roleExists) {
    return response.status(404).json({
      message: 'The Contract does not exist in the database',
      code: 404,
    });
  }

  try {
    const newNurse = await nurseModel.create({
      name: { firstName, lastName },
      age,
      gender,
      specialties,
      address: { municipality, departament },
      numberPhone,
      email,
      password,
      contract,
      role,
    });

    return response.status(201).json({
      message: 'Nurse created and stored successfully',
      code: 201,
      newNurse,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const updateNurse = async (request, response) => {
  const { id } = request.params;
  const payload = request.body;

  // ID format validation and ID exists validation
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  const nurse = await nurseModel.findById(id);

  if (!nurse) {
    return response.status(404).json({
      message: 'The nurse does not exist in the database',
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

  // Email and Number Phone already exists validation
  const { email, numberPhone } = payload;

  const emailExists =
    (await nurseModel.findOne({ email })) &&
    patientModel.findOne({ email }) &&
    doctorModel.findOne({ email });
  const phoneExists =
    (await nurseModel.findOne({ numberPhone })) &&
    patientModel.findOne({ numberPhone }) &&
    doctorModel.findOne({ numberPhone });

  if (emailExists || phoneExists) {
    return response.status(409).json({
      message:
        'Email or Number Phone already exists. Please enter a different email',
      code: 409,
    });
  }

  const { specialties, contract, role } = payload;

  if (specialties) {
    // Specialties: ID format validation, Exists validation and active validation
    if (
      !specialties.every((idEspecialty) =>
        mongoose.Types.ObjectId.isValid(idEspecialty)
      )
    ) {
      return response.status(400).json({
        message: 'One or more of the entered ID formats are invalid',
        code: 400,
      });
    }

    const specialtyPromises = specialties.map((idEspecialty) =>
      specialtyModel.findById(idEspecialty)
    );
    const specialtiesExists = await Promise.all(specialtyPromises);

    if (specialtiesExists.some((specialty) => !specialty)) {
      return response.status(404).json({
        message: 'One or more of the Specialties do not exist in the database',
        code: 404,
      });
    }

    const activePromises = specialties.map((specialtyId) =>
      specialtyModel.findOne({ _id: specialtyId, status: true })
    );

    const specialtiesActive = await Promise.all(activePromises);

    if (specialtiesActive.some((specialty) => !specialty)) {
      return response.status(400).json({
        message: 'One or more of the Specialties is not active',
        code: 400,
      });
    }
  }

  if (contract) {
    // Contract: ID format validation, Exists validation and active validation
    if (!mongoose.Types.ObjectId.isValid(contract)) {
      return response.status(400).json({
        message: 'The ID format type entered is invalid',
        code: 400,
      });
    }

    const contractExists = await contractModel.findById(contract);

    if (!contractExists) {
      return response.status(404).json({
        message: 'The Contract does not exist in the database',
        code: 404,
      });
    }

    const contractActive = await contractModel.findOne({
      _id: contract,
      status: true,
    });

    if (!contractActive) {
      return response.status(400).json({
        message: 'The Contract is not active',
        code: 400,
      });
    }
  }

  if (role) {
    // Role: ID format validation and Exists validation
    if (!mongoose.Types.ObjectId.isValid(contract)) {
      return response.status(400).json({
        message: 'The ID format type entered is invalid',
        code: 400,
      });
    }

    const roleExists = await roleModel.findById(role);

    if (!roleExists) {
      return response.status(404).json({
        message: 'The Contract does not exist in the database',
        code: 404,
      });
    }
  }
  try {
    const nurseUpload = await nurseModel.findByIdAndUpdate(id, payload, {
      new: true,
    });

    return response.status(200).json({
      message: 'nurse updated successfully',
      code: 200,
      nurseUpload,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const deleteNurse = async (request, response) => {
  const { id } = request.params;

  // ID format validation and ID exists validation
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  try {
    const nurse = await nurseModel.findById(id);

    if (!nurse) {
      return response.status(404).json({
        code: 404,
        message: 'The nurse does not exist in the database',
      });
    }

    await nurseModel.findByIdAndDelete(id);

    return response.status(200).json({
      code: 200,
      message: 'Nurse deleted successfully',
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};
