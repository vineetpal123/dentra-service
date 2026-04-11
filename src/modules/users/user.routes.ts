import { createUser, deleteUser, getUserById, getUsers, updateUser } from './user.controller';

import { authMiddleware } from '../../middleware/auth.middleware';
import { allowRoles } from '../../middleware/role.middleware';
import { validate } from '../../utils/validate';
import {
  createUserSchema,
  getUsersQuerySchema,
  updateUserSchema,
  userParamSchema,
} from './schemas/user.schema';

export default async function (fastify: any) {
  fastify.post(
    '/users',
    {
      preHandler: [
        authMiddleware,
        allowRoles(['admin', 'doctor', 'staff']),
        validate(createUserSchema),
      ],
    },
    createUser,
  );

  fastify.get(
    '/users',
    {
      preHandler: [
        authMiddleware,
        allowRoles(['admin', 'doctor', 'staff']),
        validate(getUsersQuerySchema, 'query'),
      ],
    },
    getUsers,
  );

  fastify.get(
    '/users/:id',
    {
      preHandler: [
        authMiddleware,
        allowRoles(['admin', 'doctor', 'staff']),
        validate(userParamSchema, 'params'),
      ],
    },
    getUserById,
  );

  fastify.put(
    '/users/:id',
    {
      preHandler: [
        authMiddleware,
        allowRoles(['admin']),
        validate(userParamSchema, 'params'),
        validate(updateUserSchema),
      ],
    },
    updateUser,
  );

  fastify.delete(
    '/users/:id',
    { preHandler: [authMiddleware, allowRoles(['admin']), validate(userParamSchema, 'params')] },
    deleteUser,
  );
}
