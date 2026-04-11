import { z } from 'zod';

// CREATE
export const createPatientSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  age: z.number().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

// UPDATE
export const updatePatientSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  age: z.number().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

// QUERY
export const getPatientsQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  search: z.string().optional(),
});

// PARAM
export const patientParamSchema = z.object({
  id: z.string(),
});

export type CreatePatientSchema = z.infer<typeof createPatientSchema>;
export type GetPatientsQuerySchema = z.infer<typeof getPatientsQuerySchema>;
export type UpdatePatientSchema = z.infer<typeof updatePatientSchema>;
export type PatientParamSchema = z.infer<typeof patientParamSchema>;
