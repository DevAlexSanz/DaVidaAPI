import mongoose from 'mongoose';
import contractModel from './contract.model.js';

export const getAllContract = async (request, response) => {
  try {
    const contracts = await contractModel.find();

    return response.status(200).json({
      code: 200,
      contracts,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const getContractById = async (request, response) => {
  const { id } = request.params;

  // ID format validation and ID exists validation
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  const contractExists = await contractModel.findById(id);

  if (!contractExists) {
    return response.status(404).json({
      message: 'The Contract does not exist in the database',
      code: 404,
    });
  }

  try {
    const contract = await contractModel.findById(id);

    return response.status(200).json({
      message: 'Contract was found!',
      code: 200,
      contract,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const createContract = async (request, response) => {
  const { contractType, contractPeriod } = request.body;

  // Fields validation (no empty fields)
  if (!contractType || !contractPeriod) {
    return response.status(400).json({
      message: 'The fields contractType and contractPeriod are required',
      code: 400,
    });
  }

  // Contract exists validation
  const contractExists = await contractModel.findOne({
    contractType,
    contractPeriod,
  });

  if (contractExists) {
    return response.status(409).json({
      message: 'The Contract already exists in the database',
      code: 400,
    });
  }

  try {
    const newContract = await contractModel.create({
      contractType,
      contractPeriod,
    });

    return response.status(201).json({
      message: 'Contract created and stored successfully',
      code: 201,
      newContract,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const updateContract = async (request, response) => {
  const { id } = request.params;
  const payload = request.body;

  // ID format validation and ID exists validation
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  const contract = await contractModel.findById(id);

  if (!contract) {
    return response.status(404).json({
      message: 'The Contract does not exist in the database',
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

  // Contract already exists validation
  const { contractType, contractPeriod } = payload;

  const contractExists = await contractModel.findOne({
    contractType,
    contractPeriod,
  });

  if (contractExists) {
    return response.status(409).json({
      message: 'The Contract already exists in the database',
      code: 400,
    });
  }

  try {
    const contractUpdated = await contractModel.findByIdAndUpdate(id, payload, {
      new: true,
    });

    return response.status(200).json({
      message: 'Contract updated successfully',
      code: 200,
      contractUpdated,
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const deleteContract = async (request, response) => {
  const { id } = request.params;

  // ID format validation and ID exists validation
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: 'The ID format type entered is invalid',
      code: 400,
    });
  }

  const contract = await contractModel.findById(id);

  if (!contract) {
    return response.status(404).json({
      code: 404,
      message: 'The Contract does not exist in the database',
    });
  }

  try {
    await contractModel.findByIdAndDelete(id);

    return response.status(200).json({
      code: 200,
      message: 'Contract deleted successfully',
    });
  } catch (err) {
    console.error(err.message);

    return response.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};
