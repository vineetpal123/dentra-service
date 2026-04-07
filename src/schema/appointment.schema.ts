import { z } from 'zod';

export const createAppointmentSchema = z.object({
  patientId: z.string(),
  doctorId: z.string(),

  date: z.string(), // later you can enforce ISO date
  startTime: z.string(),
  endTime: z.string(),

  notes: z.string().optional(),
});
