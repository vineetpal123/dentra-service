import { z } from 'zod';

export const sendOtpSchema = z.object({
  phone: z.string().min(10).max(15), // Adjust regex if needed for phone validation
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
