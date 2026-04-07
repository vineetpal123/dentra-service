import { z } from 'zod';

export const sendOtpSchema = z.object({
  mobile: z.string().min(10),
});

export const verifyOtpSchema = z.object({
  mobile: z.string().min(10),
  otp: z.string().length(4),
});
