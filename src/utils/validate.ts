import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError, ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema, type: 'body' | 'query' | 'params' = 'body') =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data =
        type === 'body' ? request.body : type === 'query' ? request.query : request.params;

      const parsed = schema.parse(data);

      // assign back parsed data
      if (type === 'body') request.body = parsed;
      if (type === 'query') request.query = parsed;
      if (type === 'params') request.params = parsed;
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

      return reply.code(400).send({
        success: false,
        errors: [{ code: 'UNKNOWN_ERROR', message: 'Invalid request' }],
      });
    }
  };
