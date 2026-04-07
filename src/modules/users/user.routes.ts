import { createUser, deleteUser, getUserById, getUsers } from './user.controller';

import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../utils/validate';
import { createUserSchema, getUsersQuerySchema } from './schemas/user.schema';

export default async function (fastify: any) {
  fastify.post(
    '/users',
    {
      preHandler: [authMiddleware, validate(createUserSchema)],
    },
    createUser,
  );

  fastify.get(
    '/users',
    {
      preHandler: [authMiddleware, validate(getUsersQuerySchema)],
    },
    getUsers,
  );

  fastify.get('/users/:id', { preHandler: authMiddleware }, getUserById);

  fastify.delete('/users/:id', { preHandler: authMiddleware }, deleteUser);
}
