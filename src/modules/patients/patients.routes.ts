import {
  createPatient,
  deletePatient,
  getPatientById,
  getPatients,
  updatePatient,
} from './patients.controller';

import { authMiddleware } from '../../middleware/auth.middleware';
import { allowRoles } from '../../middleware/role.middleware';
import { validate } from '../../utils/validate';

import {
  createPatientSchema,
  getPatientsQuerySchema,
  patientParamSchema,
  updatePatientSchema,
} from './schemas/patient.schema';

export default async function (fastify: any) {
  fastify.post(
    '/patients',
    {
      preHandler: [
        authMiddleware,
        allowRoles(['admin', 'doctor', 'staff']),
        validate(createPatientSchema),
      ],
    },
    createPatient,
  );

  fastify.get(
    '/patients',
    {
      preHandler: [
        authMiddleware,
        allowRoles(['admin', 'doctor', 'staff']),
        validate(getPatientsQuerySchema, 'query'),
      ],
    },
    getPatients,
  );

  fastify.get(
    '/patients/:id',
    {
      preHandler: [authMiddleware, validate(patientParamSchema, 'params')],
    },
    getPatientById,
  );

  fastify.put(
    '/patients/:id',
    {
      preHandler: [
        authMiddleware,
        allowRoles(['admin', 'doctor', 'staff']),
        validate(patientParamSchema, 'params'),
        validate(updatePatientSchema),
      ],
    },
    updatePatient,
  );

  fastify.delete(
    '/patients/:id',
    {
      preHandler: [
        authMiddleware,
        allowRoles(['admin', 'doctor']),
        validate(patientParamSchema, 'params'),
      ],
    },
    deletePatient,
  );
}
