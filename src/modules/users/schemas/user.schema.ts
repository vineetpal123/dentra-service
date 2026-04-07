import { z } from 'zod';

export const createUserSchema = z.object({
  mobile: z.string().regex(/^[1-9]\d{9}$/, 'Invalid mobile number'),
  name: z.string().min(2),
  role: z.enum(['admin', 'doctor', 'staff']),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const getUsersQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  role: z.enum(['admin', 'doctor', 'staff']).optional(),
});

export type GetUsersQuerySchema = z.infer<typeof getUsersQuerySchema>;
