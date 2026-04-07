import { z } from 'zod';

export const createPatientSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  mobile: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  age: z.number().min(0).max(120).optional(),
});
