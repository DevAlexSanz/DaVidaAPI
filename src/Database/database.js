import mongoose from 'mongoose';
import { enviromentConfig } from '../Config/config.js';

export const initializeDB = async () => {
  try {
    const { database } = enviromentConfig;

    await mongoose.connect(database.uri, database.options);

    console.log(
      '===========================================================\n' +
      '               MongoDB Connection Succesfully'
    );

    return mongoose;
  } catch (err) {
    console.error(err.message);

    return null;
  }
};
