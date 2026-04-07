import { z } from 'zod';

export const verifyOtpSchema = z.object({
  mobile: z.string().min(10).max(15),
  otp: z.string().length(4), // Assuming 4-digit OTP
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
