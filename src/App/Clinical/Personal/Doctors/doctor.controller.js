import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import doctorModel from './doctor.model.js';
import { enviromentConfig } from '../../../../Config/config.js';

// Validations helpers
import patientModel from '../../Patients/patient.model.js';
import nurseModel from '../Nurses/nurse.model.js';
import roleModel from '../../Roles/role.model.js';
import contractModel from '../../Contracts/contract.model.js';
import specialtyModel from '../../Areas/Specialties/specialty.model.js';

const { tokenSecret } = enviromentConfig;

export const signIn = async (request, response) => {
  const { email, password } = request.body;

  //  Doctor exists in database validation
  const doctorExists = await doctorModel.findOne({ email }).populate('role');

  if (!doctorExists) {
    return response.status(400).json({
      message: 'Doctor not found',
      code: 400,
    });
  }

  const matchPassword = await doctorModel.comparePassword(
    password,
    doctorExists.password
  );

  // compare password validation
  if (!matchPassword) {
    return response.status(401).json({
      message: 'Invalid password',
      code: 401,
    });
  }

  try {
    const token = jwt.sign({ id: doctorExists._id }, tokenSecret, {
      expiresIn: 86400,
    });

    return response.status(200).json({
      message: 'Doctor logged successfully',
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

export const getAllDoctors = async (request, response) => {
  try {
    const doctors = await doctorModel
      .find()
      .populate(['specialties', 'contract', 'role']);

    return response.status(200).json({
      code: 200,
      doctors,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const getDoctorById = async (request, response) => {
  const { id } = request.params;

  // ID format validation and ID exists validation
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  const doctorExists = await doctorModel.findById(id);

  if (!doctorExists) {
    return response.status(404).json({
      message: 'The Doctor does not exist in the database',
      code: 404,
    });
  }

  try {
    const doctor = await doctorModel
      .findById(id)
      .populate(['specialties', 'contract', 'role']);

    return response.status(200).json({
      message: 'Doctor was found!',
      code: 200,
      doctor,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const createDoctor = async (request, response) => {
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
        'The fields fullname, age, gender, specialties, address, numberPhone, email, password, contract and role are required',
      code: 400,
    });
  }

  // Email and Number Phone already exists validation
  const emailExists =
    (await doctorModel.findOne({ email })) &&
    patientModel.findOne({ email }) &&
    nurseModel.findOne({ email });

  const phoneExists =
    (await doctorModel.findOne({ numberPhone })) &&
    patientModel.findOne({ numberPhone }) &&
    nurseModel.findOne({ numberPhone });

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
    const newDoctor = await doctorModel.create({
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
      message: 'Doctor created and stored successfully',
      code: 201,
      newDoctor,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const updateDoctor = async (request, response) => {
  const { id } = request.params;
  const payload = request.body;

  // ID format validation and ID exists validation
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  const doctor = await doctorModel.findById(id);

  if (!doctor) {
    return response.status(404).json({
      message: 'The doctor does not exist in the database',
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

  const existingEmail =
    (await doctorModel.findOne({ email })) &&
    patientModel.findOne({ email }) &&
    nurseModel.findOne({ email });
  const existingPhone =
    (await doctorModel.findOne({ numberPhone })) &&
    patientModel.findOne({ numberPhone }) &&
    nurseModel.findOne({ numberPhone });

  if (existingEmail || existingPhone) {
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
    const doctorUpload = await doctorModel.findByIdAndUpdate(id, payload, {
      new: true,
    });

    return response.status(200).json({
      message: 'Doctor updated successfully',
      code: 200,
      doctorUpload,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const deleteDoctor = async (request, response) => {
  const { id } = request.params;

  // ID format validation and ID exists validation
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  try {
    const doctor = await doctorModel.findById(id);

    if (!doctor) {
      return response.status(404).json({
        code: 404,
        message: 'The doctor does not exist in the database',
      });
    }

    await doctorModel.findByIdAndDelete(id);

    return response.status(200).json({
      code: 200,
      message: 'Doctor deleted successfully',
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};
