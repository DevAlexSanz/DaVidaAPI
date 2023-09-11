import { Schema, model } from 'mongoose';

const contractSchema = new Schema(
  {
    contractType: {
      type: String,
      required: true,
    },
    contractPeriod: {
      type: String,
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

contractSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id;
  },
});

export default model('Contract', contractSchema);
