import mongoose, { Document, Schema } from 'mongoose';

export type AppointmentStatus = 'booked' | 'cancelled' | 'completed' | 'no-show' | 'draft';

export interface IAppointment extends Document {
  tenantId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: false,
      default: null,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },
    date: { type: String, required: false },
    startTime: { type: String, required: false },
    endTime: { type: String, required: false },
    status: {
      type: String,
      enum: ['booked', 'cancelled', 'completed', 'no-show', 'draft'],
      default: 'draft',
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: String,
  },

  { timestamps: true },
);

// Indexing
appointmentSchema.index({ tenantId: 1, date: 1 });
appointmentSchema.index({ doctorId: 1, date: 1 });

export const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);
