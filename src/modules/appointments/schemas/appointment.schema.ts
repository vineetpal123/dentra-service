import { z } from 'zod';
import { createPatientSchema } from '../../patients/schemas/patient.schema';

// CREATE
export const createAppointmentSchema = z.object({
  patientId: z.string().optional(),
  doctorId: z.string().optional(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  notes: z.string().optional(),
  patient: createPatientSchema.optional(), // For new patient creation
});

// UPDATE / RESCHEDULE
export const updateAppointmentSchema = z.object({
  date: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  status: z.enum(['booked', 'cancelled', 'completed', 'no-show']).optional(),
  notes: z.string().optional(),
});

// QUERY
export const getAppointmentsQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  doctorId: z.string().optional(),
  date: z.string().optional(),
  status: z.enum(['booked', 'cancelled', 'completed', 'no-show']).optional(),
});

// PARAM
export const appointmentParamSchema = z.object({
  id: z.string(),
});

export type CreateAppointmentSchema = z.infer<typeof createAppointmentSchema>;
export type GetAppointmentsQuerySchema = z.infer<typeof getAppointmentsQuerySchema>;
export type UpdateAppointmentSchema = z.infer<typeof updateAppointmentSchema>;
export type AppointmentParamSchema = z.infer<typeof appointmentParamSchema>;
