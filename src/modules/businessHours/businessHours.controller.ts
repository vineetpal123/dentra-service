import { FastifyReply, FastifyRequest } from 'fastify';

import { ERROR_CODES } from '../../constants/errorCodes';
import { errorResponse, successResponse } from '../../utils/response';

export const getBusinessHours = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // const userId = request?.user?.id;
    // console.log('Dashboard  User ID:', userId);

    const data = [
      {
        day: 'Monday',
        isClosed: false,
        slots: [{ startTime: '08:00', endTime: '17:00' }],
      },
      {
        day: 'Tuesday',
        isClosed: false,
        slots: [{ startTime: '08:00', endTime: '17:00' }],
      },
      {
        day: 'Wednesday',
        isClosed: false,
        slots: [{ startTime: '08:00', endTime: '13:00' }],
      },
      {
        day: 'Thursday',
        isClosed: false,
        slots: [{ startTime: '09:00', endTime: '18:00' }],
      },
      {
        day: 'Friday',
        isClosed: false,
        slots: [{ startTime: '09:00', endTime: '15:00' }],
      },
      { day: 'Saturday', isClosed: true, slots: [] },
      { day: 'Sunday', isClosed: true, slots: [] },
    ];

    return reply.send(successResponse('Api successful', data));
  } catch (err) {
    return reply.status(500).send(errorResponse('Server error', ERROR_CODES.SERVER_ERROR));
  }
};
