import mongoose, { Document, Schema } from 'mongoose';

export type AppointmentStatus = 'booked' | 'cancelled' | 'completed' | 'no-show';

export interface IAppointment extends Document {
  tenantId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
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
      required: true,
    },

    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    date: { type: String, required: true },

    startTime: String,
    endTime: String,

    status: {
      type: String,
      enum: ['booked', 'cancelled', 'completed', 'no-show'],
      default: 'booked',
      index: true,
    },

    notes: String,
  },
  { timestamps: true },
);

// Indexing
appointmentSchema.index({ tenantId: 1, date: 1 });
appointmentSchema.index({ doctorId: 1, date: 1 });

export const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);
