import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';
import roleModel from '../../Roles/role.model.js';

const adminSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: roleModel,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

adminSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

adminSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword);
};

adminSchema.pre('save', async function (next) {
  const admin = this;
  if (!admin.isModified('password')) {
    return next();
  }
  const hash = await bcrypt.hash(admin.password, 10);
  admin.password = hash;
  next();
});

export default model('Admin', adminSchema);
