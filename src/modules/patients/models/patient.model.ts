import mongoose, { Document, Schema } from 'mongoose';

export interface IPatient extends Document {
  tenantId: mongoose.Types.ObjectId;
  name: string;
  phone?: string;
  gender?: string;
  age?: number;
  createdBy: mongoose.Types.ObjectId;
  isDeleted: boolean;
}

const patientSchema = new Schema<IPatient>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    phone: String,
    gender: String,
    age: Number,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

export const Patient = mongoose.model<IPatient>('Patient', patientSchema);
