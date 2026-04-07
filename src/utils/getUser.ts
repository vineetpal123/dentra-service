import { FastifyRequest } from 'fastify';
import { JwtUser } from '../types/auth';

export const getUser = (request: FastifyRequest): JwtUser => {
  return (request as any).user;
};
