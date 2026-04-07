import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError, ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema) => async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.body = schema.parse(request.body);
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.code(400).send({
          success: false,
          errors: err.issues.map((e) => ({
            code: 'VALIDATION_ERROR',
            message: e.message,
            field: e.path.join('.'),
          })),
        });
      }

      // fallback error
      return reply.code(400).send({
        success: false,
        errors: [
          {
            code: 'UNKNOWN_ERROR',
            message: 'Invalid request',
          },
        ],
      });
    }
  };
