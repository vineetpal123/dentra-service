import { FastifyReply, FastifyRequest } from 'fastify';

import { ERROR_CODES } from '../../constants/errorCodes';
import { errorResponse, successResponse } from '../../utils/response';

export const getAppointments = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // const userId = request?.user?.id;
    // console.log('Dashboard  User ID:', userId);

    const data = [
      {
        id: 1,
        patient: 'John Doe',
        doctor: 'Dr. Smith',
        date: '2026-01-15',
        time: '10:00',
        status: 'Confirmed',
      },
      {
        id: 2,
        patient: 'Jane Roe',
        doctor: 'Dr. Adams',
        date: '2026-01-16',
        time: '14:00',
        status: 'Pending',
      },
      {
        id: 1768137080637,
        patient: 'New Patient',
        doctor: 'Dr New',
        date: '2026-01-21',
        time: '11:00',
        status: 'Pending',
      },
      {
        id: 1768137087589,
        patient: 'New Patient',
        doctor: 'Dr New',
        date: '2026-01-21',
        time: '11:00',
        status: 'Pending',
      },
      {
        id: 1768152309565,
        patient: 'vineet',
        doctor: 'abcd',
        date: '2026-01-14',
        time: '22:55',
        status: 'Pending',
      },
      {
        id: 1768235141105,
        patient: 'vineet',
        doctor: 'ramesh',
        date: '2026-01-13',
        time: '10:55',
        status: 'Pending',
      },
      {
        id: 1768238903316,
        patient: 'vineet',
        doctor: 'ramesh',
        date: '2026-01-13',
        time: '01:58',
        status: 'Confirmed',
      },
      {
        id: 1768239345000,
        patient: 'vineet pal',
        doctor: 'ramesh',
        date: '2026-01-13',
        time: '11:05',
        status: 'Pending',
      },
      {
        id: 1768731745450,
        patient: 'vineet',
        doctor: 'ramesh',
        date: '2026-01-19',
        time: '09:00',
        status: 'Pending',
      },
      {
        id: 1768731935328,
        patient: 'vineet',
        doctor: 'ramesh',
        date: '2026-01-19',
        time: '03:55',
        status: 'Pending',
      },
      {
        id: 1773940637907,
        patient: 'ramesh',
        doctor: 'suresh',
        date: '2026-03-20',
        time: '10:47',
        status: 'Pending',
      },
      {
        id: 1774188400753,
        patient: 'gojo',
        doctor: 'saturo',
        date: '2026-03-23',
        time: '10:39',
        status: 'Pending',
      },
    ];

    return reply.send(successResponse('Api successful', data));
  } catch (err) {
    return reply.status(500).send(errorResponse('Server error', ERROR_CODES.SERVER_ERROR));
  }
};
