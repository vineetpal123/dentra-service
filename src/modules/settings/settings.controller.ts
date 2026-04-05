import { FastifyReply, FastifyRequest } from 'fastify';

import { ERROR_CODES } from '../../constants/errorCodes';
import { errorResponse, successResponse } from '../../utils/response';

export const getSettings = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // const userId = request?.user?.id;
    // console.log('Dashboard  User ID:', userId);

    const data = {
      clinicName: 'Dentra Clinic',
      email: 'clinic@gmail.com',
      phone: '9999999999',
      address: 'Bangalore',
      profileImage: '',
      notifications: true,
    };

    return reply.send(successResponse('Api successful', data));
  } catch (err) {
    return reply.status(500).send(errorResponse('Server error', ERROR_CODES.SERVER_ERROR));
  }
};
