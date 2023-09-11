import roleModel from '../App/Clinical/Roles/role.model.js';
import adminModel from '../App/Clinical/Personal/Administrator/admin.model.js';
import { enviromentConfig } from '../Config/config.js';

const { adminCredential } = enviromentConfig;
const { email, password } = adminCredential;

export const setRoles = async () => {
  try {
    const count = await roleModel.estimatedDocumentCount();

    if (count > 0)
      return console.log(
        '===========================================================\n' +
        '                     Roles already set'
      );

    await Promise.all([
      new roleModel({ name: 'admin' }).save(),
      new roleModel({ name: 'doctor' }).save(),
      new roleModel({ name: 'nurse' }).save(),
    ]);

    console.log(
      '===========================================================\n' +
      '                 Roles created successfully'
    );
  } catch (err) {
    return console.error(err.message);
  }
};

export const setAdmin = async () => {
  const existsAdmin = await adminModel.findOne({ email });

  if (existsAdmin) {
    return console.log(
      '===========================================================\n' +
      '                     Admin already set'
    );
  }

  const role = await roleModel.findOne({ name: 'admin' });

  adminModel.create({
    email,
    password,
    role: role._id,
  });

  console.log(
    '===========================================================\n' +
    '                 Admin created successfully'
  );
};
