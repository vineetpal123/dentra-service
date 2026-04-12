import { FastifyReply, FastifyRequest } from 'fastify';
import { getUser } from '../../utils/getUser';
import { User } from './models/user.model';
import { CreateUserSchema } from './schemas/user.schema';

export const createUser = async (
  request: FastifyRequest<{ Body: CreateUserSchema }>,
  reply: FastifyReply,
) => {
  try {
    const requestedUser = getUser(request);
    if (requestedUser.role !== 'admin') {
      return reply.code(403).send({
        success: false,
        errors: [{ code: 'FORBIDDEN', message: 'Admin only' }],
      });
    }

    const { phone } = request.body;
    const tenantId = requestedUser?.tenantId;

    const existing = await User.findOne({
      phone: phone,
      tenantId: tenantId,
    });

    if (existing) {
      return reply.code(400).send({
        success: false,
        errors: [{ code: 'USER_EXISTS', message: 'User already exists' }],
      });
    }

    console.log('Creating user with tenantId:', tenantId);
    console.log('Creating user with tenantId:', {
      ...request.body,
      tenantId: tenantId,
      isApproved: true,
    });

    const user = await User.create({
      ...request.body,
      tenantId: tenantId,
      isApproved: true,
    });

    return reply.send({ success: true, data: user });
  } catch (err: any) {
    return reply.code(500).send({
      success: false,
      errors: [{ code: 'CREATE_USER_ERROR', message: err.message }],
    });
  }
};

// 📄 GET USERS (with pagination)
export async function getUsers(request: any, reply: FastifyReply) {
  try {
    const currentUser = request.user;
    console.log('Get Users - Tenant ID:', request.user.tenantId);
    const { page = '1', limit = '10', role, search } = request.query;

    const query: any = {
      tenantId: currentUser.tenantId,
      isDeleted: false,
      _id: { $ne: currentUser.id }, // Exclude self from list
    };

    if (role) query.role = role;

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const users = await User.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return reply.send({
      success: true,
      data: {
        users,
        total,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (err: any) {
    return reply.code(500).send({
      success: false,
      errors: [{ code: 'FETCH_USERS_ERROR', message: err.message }],
    });
  }
}

// 🔍 GET SINGLE USER
export async function getUserById(request: any, reply: FastifyReply) {
  try {
    const user = await User.findOne({
      _id: request.params.id,
      tenantId: request.user.tenantId,
      isDeleted: false,
    });

    if (!user) {
      return reply.code(404).send({
        success: false,
        errors: [{ code: 'NOT_FOUND', message: 'User not found' }],
      });
    }

    return reply.send({ success: true, data: user });
  } catch (err: any) {
    return reply.code(500).send({
      success: false,
      errors: [{ code: 'FETCH_USER_ERROR', message: err.message }],
    });
  }
}

// ✏️ UPDATE USER
export async function updateUser(request: any, reply: FastifyReply) {
  const currentUser = request.user;

  if (currentUser.role !== 'admin') {
    return reply.code(403).send({
      success: false,
      errors: [{ code: 'FORBIDDEN', message: 'Admin only' }],
    });
  }

  const user = await User.findOneAndUpdate(
    {
      _id: request.params.id,
      tenantId: currentUser.tenantId,
      isDeleted: false,
    },
    request.body,
    { new: true },
  );

  if (!user) {
    return reply.code(404).send({
      success: false,
      errors: [{ code: 'NOT_FOUND', message: 'User not found' }],
    });
  }

  return reply.send({ success: true, data: user });
}

// ❌ DELETE USER (Admin only)
export async function deleteUser(request: any, reply: FastifyReply) {
  const currentUser = request.user;
  try {
    if (currentUser.role !== 'admin') {
      return reply.code(403).send({
        success: false,
        errors: [{ code: 'FORBIDDEN', message: 'Admin only' }],
      });
    }

    const user = await User.findOneAndUpdate(
      {
        _id: request.params.id,
        tenantId: currentUser.tenantId,
      },
      { isDeleted: true },
      { new: true },
    );

    if (!user) {
      return reply.code(404).send({
        success: false,
        errors: [{ code: 'NOT_FOUND', message: 'User not found' }],
      });
    }

    return reply.send({
      success: true,
      data: { message: 'User deleted' },
    });
  } catch (err: any) {
    return reply.code(500).send({
      success: false,
      errors: [{ code: 'DELETE_USER_ERROR', message: err.message }],
    });
  }
}
