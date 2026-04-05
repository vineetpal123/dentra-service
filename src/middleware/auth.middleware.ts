import { FastifyReply, FastifyRequest } from 'fastify';
import { ERROR_CODES } from '../constants/errorCodes';
import { verifyToken } from '../utils/jwt';
import { errorResponse } from '../utils/response';

export const authMiddleware = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return reply.status(401).send(errorResponse('Unauthorized', ERROR_CODES.UNAUTHORIZED));
    }

    const token = authHeader.split(' ')[1];

    const decoded: any = verifyToken(token);

    (req as any).user = decoded;
  } catch (err) {
    return reply.status(401).send(errorResponse('Invalid token', ERROR_CODES.UNAUTHORIZED));
  }
};
