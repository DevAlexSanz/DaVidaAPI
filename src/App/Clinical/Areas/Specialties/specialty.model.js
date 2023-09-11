import { Schema, model } from 'mongoose';
import areaModel from '../area.model.js';

const specialtySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    area: {
      type: Schema.Types.ObjectId,
      ref: areaModel,
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

specialtySchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id;
  },
});

export default model('Specialty', specialtySchema);
