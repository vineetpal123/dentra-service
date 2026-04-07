import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { ERROR_CODES } from '../constants/errorCodes';
import { errorResponse } from '../utils/response';

export const authMiddleware = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader);
    if (!authHeader) {
      return reply.status(401).send(errorResponse('Unauthorized', ERROR_CODES.UNAUTHORIZED));
    }

    const token = authHeader.split(' ')[2];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      tenantId: string;
      role: 'admin' | 'doctor' | 'staff';
    };

    console.log('Decoded Token:', decoded);

    (req as any).user = decoded;
  } catch (err) {
    return reply.status(401).send(errorResponse('Invalid token', ERROR_CODES.UNAUTHORIZED));
  }
};
