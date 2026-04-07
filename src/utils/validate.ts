import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema) => async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.body = schema.parse(request.body);
    } catch (err: any) {
      return reply.code(400).send({
        success: false,
        errors: err.errors.map((e: any) => ({
          code: 'VALIDATION_ERROR',
          message: e.message,
          field: e.path.join('.'),
        })),
      });
    }
  };
