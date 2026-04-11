import { z } from 'zod';

export const createUserSchema = z.object({
  mobile: z.string().regex(/^[1-9]\d{9}$/, 'Invalid mobile number'),
  name: z.string().min(2),
  role: z.enum(['admin', 'doctor', 'staff']),
  tenantId: z.string().optional(),
});

export const getUsersQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  role: z.enum(['admin', 'doctor', 'staff']).optional(),
  search: z.string().optional(),
});

// UPDATE
export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(['admin', 'doctor', 'staff']).optional(),
});

// PARAM
export const userParamSchema = z.object({
  id: z.string(),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type GetUsersQuerySchema = z.infer<typeof getUsersQuerySchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type UserParamSchema = z.infer<typeof userParamSchema>;
