import {
  cancelAppointment,
  createAppointment,
  getAppointmentById,
  getAppointments,
  updateAppointment,
} from './appointments.controller';

import { authMiddleware } from '../../middleware/auth.middleware';
import { allowRoles } from '../../middleware/role.middleware';
import { validate } from '../../utils/validate';

import {
  appointmentParamSchema,
  createAppointmentSchema,
  getAppointmentsQuerySchema,
  updateAppointmentSchema,
} from './schemas/appointment.schema';

export default async function (fastify: any) {
  fastify.post(
    '/appointments',
    {
      preHandler: [
        authMiddleware,
        allowRoles(['admin', 'doctor', 'staff']),
        validate(createAppointmentSchema),
      ],
    },
    createAppointment,
  );

  fastify.get(
    '/appointments',
    {
      preHandler: [
        authMiddleware,
        allowRoles(['admin', 'doctor', 'staff']),
        validate(getAppointmentsQuerySchema, 'query'),
      ],
    },
    getAppointments,
  );

  fastify.get(
    '/appointments/:id',
    {
      preHandler: [authMiddleware, validate(appointmentParamSchema, 'params')],
    },
    getAppointmentById,
  );

  fastify.put(
    '/appointments/:id',
    {
      preHandler: [
        authMiddleware,
        allowRoles(['admin', 'doctor']),
        validate(appointmentParamSchema, 'params'),
        validate(updateAppointmentSchema),
      ],
    },
    updateAppointment,
  );

  fastify.delete(
    '/appointments/:id/cancel',
    {
      preHandler: [
        authMiddleware,
        allowRoles(['admin', 'doctor']),
        validate(appointmentParamSchema, 'params'),
      ],
    },
    cancelAppointment,
  );
}
