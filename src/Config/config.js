import dotenv from 'dotenv';

dotenv.config();

export const enviromentConfig = {
  port: process.env.PORT || 3000,
  url: process.env.URL || 'http://localhost:',
  database: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  tokenSecret: process.env.JWT_SECRET,
  adminCredential: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
};
