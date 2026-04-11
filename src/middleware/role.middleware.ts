import { FastifyReply, FastifyRequest } from 'fastify';
import { getUser } from '../utils/getUser';

export const allowRoles =
  (roles: Array<'admin' | 'doctor' | 'staff'>) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getUser(request);
    console.log('User Role:', user);
    if (!roles.includes(user.role)) {
      return reply.code(403).send({
        success: false,
        errors: [{ code: 'FORBIDDEN', message: 'Access denied' }],
      });
    }
  };
