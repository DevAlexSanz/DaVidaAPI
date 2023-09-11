import { Schema, model } from 'mongoose';

const patientSchema = new Schema(
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
    allergies: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
      },
    ],
    address: {
      municipio: {
        type: String,
        required: true,
      },
      departamento: {
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

patientSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id;
  },
});

export default model('Patient', patientSchema);
