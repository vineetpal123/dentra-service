import { FastifyReply, FastifyRequest } from 'fastify';

import { ERROR_CODES } from '../../constants/errorCodes';
import { errorResponse, successResponse } from '../../utils/response';

export const getPatients = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // const userId = request?.user?.id;
    // console.log('Dashboard  User ID:', userId);

    const data = [
      {
        id: 1,
        name: 'John Doe',
        phone: '123-456-7890',
        lastVisit: '2023-10-01',
        status: 'Active',
      },
      {
        id: 2,
        name: 'Anna Lee',
        phone: '098-765-4321',
        lastVisit: '2023-10-02',
        status: 'Inactive',
      },
    ];

    return reply.send(successResponse('Api successful', data));
  } catch (err) {
    return reply.status(500).send(errorResponse('Server error', ERROR_CODES.SERVER_ERROR));
  }
};
