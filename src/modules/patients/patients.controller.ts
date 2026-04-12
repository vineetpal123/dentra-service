import { FastifyReply, FastifyRequest } from 'fastify';

import { ERROR_CODES } from '../../constants/errorCodes';
import { getUser } from '../../utils/getUser';
import { errorResponse, successResponse } from '../../utils/response';
import { Patient } from './models/patient.model';
import { CreatePatientSchema } from './schemas/patient.schema';

export async function createPatient(
  request: FastifyRequest<{ Body: CreatePatientSchema }>,
  reply: FastifyReply,
) {
  try {
    const currentUser = getUser(request);

    console.log('Creating patient with data:', request.body, 'for tenant:', currentUser.tenantId);

    const patient = await Patient.create({
      ...request.body,
      tenantId: currentUser.tenantId,
      createdBy: currentUser?.id,
    });

    return reply.send({ success: true, data: patient });
  } catch (err) {
    return reply.status(500).send(errorResponse('Server error', ERROR_CODES.SERVER_ERROR));
  }
}

export const getPatients = async (request: any, reply: FastifyReply) => {
  try {
    const currentUser = request.user;

    const { page = 1, limit = 10, search } = request.query;

    const query: any = {
      tenantId: currentUser.tenantId,
      isDeleted: false,
    };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const patients = await Patient.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Patient.countDocuments(query);

    return reply.send(successResponse('Api successful', { patients, total, page, limit }));
  } catch (err) {
    return reply.status(500).send(errorResponse('Server error', ERROR_CODES.SERVER_ERROR));
  }
};

export async function getPatientById(request: any, reply: FastifyReply) {
  try {
    const currentUser = request.user;

    const patient = await Patient.findOne({
      _id: request.params.id,
      tenantId: currentUser.tenantId,
      isDeleted: false,
    });

    if (!patient) {
      return reply.code(404).send({
        success: false,
        errors: [{ code: 'NOT_FOUND', message: 'Patient not found' }],
      });
    }

    return reply.send(successResponse('Api successful', patient));
  } catch (err) {
    return reply.status(500).send(errorResponse('Server error', ERROR_CODES.SERVER_ERROR));
  }
}
export async function updatePatient(request: any, reply: FastifyReply) {
  try {
    const currentUser = request.user;
    const patient = await Patient.findOneAndUpdate(
      {
        _id: request.params.id,
        tenantId: currentUser.tenantId,
        isDeleted: false,
      },
      request.body,
      { new: true },
    );

    if (!patient) {
      return reply.code(404).send({
        success: false,
        errors: [{ code: 'NOT_FOUND', message: 'Patient not found' }],
      });
    }

    return reply.send(successResponse('Api successful', patient));
  } catch (err) {
    return reply.status(500).send(errorResponse('Server error', ERROR_CODES.SERVER_ERROR));
  }
}

// ❌ DELETE PATIENT (SOFT DELETE)
export async function deletePatient(request: any, reply: FastifyReply) {
  try {
    const currentUser = request.user;
    const patient = await Patient.findOneAndUpdate(
      {
        _id: request.params.id,
        tenantId: currentUser.tenantId,
      },
      { isDeleted: true },
      { new: true },
    );

    if (!patient) {
      return reply.code(404).send({
        success: false,
        errors: [{ code: 'NOT_FOUND', message: 'Patient not found' }],
      });
    }

    return reply.send(successResponse('Api successful', { message: 'Patient deleted' }));
  } catch (err) {
    return reply.status(500).send(errorResponse('Server error', ERROR_CODES.SERVER_ERROR));
  }
}
