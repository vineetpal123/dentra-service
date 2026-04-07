import { FastifyInstance } from 'fastify';
import { sendOtpSchema, verifyOtpSchema } from '../../schema/auth.schema';
import { validate } from '../../utils/validate';
import { sendOtp, verifyOtp } from './auth.controller';

export default async function (fastify: FastifyInstance) {
  fastify.post('/send-otp', {
    preHandler: validate(sendOtpSchema),
    handler: sendOtp,
  });

  fastify.post('/verify-otp', {
    preHandler: validate(verifyOtpSchema),
    handler: verifyOtp,
  });
}
