import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';

// Relacionships models
import specialtyModel from '../../Areas/Specialties/specialty.model.js';
import contractModel from '../../Contracts/contract.model.js';
import roleModel from '../../Roles/role.model.js';

const doctorSchema = new Schema(
  {
    name: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    specialties: [
      {
        type: Schema.Types.ObjectId,
        ref: specialtyModel,
        req: true,
      },
    ],
    address: {
      municipality: {
        type: String,
        required: true,
      },
      departament: {
        type: String,
        required: true,
      },
    },
    numberPhone: {
      type: Number,
      required: true,
      maxlength: 8,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    contract: {
      type: Schema.Types.ObjectId,
      ref: contractModel,
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: roleModel,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

doctorSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id;
  },
});

doctorSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

doctorSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword);
};

doctorSchema.pre('save', async function (next) {
  const doctor = this;
  if (!doctor.isModified('password')) {
    return next();
  }
  const hash = await bcrypt.hash(doctor.password, 10);
  doctor.password = hash;
  next();
});

export default model('Doctor', doctorSchema);
