import { FastifyReply } from 'fastify';

import { ERROR_CODES } from '../../constants/errorCodes';
import { getUser } from '../../utils/getUser';
import { errorResponse, successResponse } from '../../utils/response';
import { Patient } from '../patients/models/patient.model';
import { Appointment } from './models/appointment.model';

export async function createAppointment(request: any, reply: any) {
  try {
    const user = getUser(request);

    let { patientId, doctorId, date, startTime, endTime } = request.body;

    if (!doctorId) doctorId = undefined;
    if (!date) date = undefined;
    if (!startTime) startTime = undefined;
    if (!endTime) endTime = undefined;

    console.log('Create Appointment Payload:', request.body);
    // ✅ handle new patient
    if (!patientId && request.body.patient) {
      const newPatient = await Patient.create({
        ...request.body.patient,
        tenantId: user.tenantId,
        createdBy: user.id,
      });

      console.log('Create newPatient:', newPatient);

      patientId = newPatient._id;
    }

    let status = 'draft';
    // 🔥 Conflict check
    if (doctorId && date && startTime) {
      console.log('check existing-----------');
      // conflict check
      const existing = await Appointment.findOne({
        tenantId: user.tenantId,
        doctorId,
        date,
        startTime,
        status: { $ne: 'cancelled' },
      });
      console.log('Existing Appointment:', existing);
      if (existing) {
        return reply.code(400).send({
          success: false,
          errors: [{ code: 'SLOT_BOOKED', message: 'Slot already booked' }],
        });
      }

      status = 'booked';
    }
    console.log('create appointment-----------', {
      patientId,
      doctorId,
      date,
      startTime,
      tenantId: user.tenantId,
      status,
      endTime,
      notes: request.body.notes,
      createdBy: user?.id,
    });
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      startTime,
      tenantId: user.tenantId,
      status,
      createdBy: user?.id,
      endTime,
      notes: request.body.notes,
    });

    console.log('create appointment created-----------', appointment);

    return reply.send(successResponse('Api successful', appointment));
  } catch (err) {
    console.log('Error creating appointment:', err);
    return reply.status(500).send(errorResponse('Server error', ERROR_CODES.SERVER_ERROR));
  }
}

export const getAppointments = async (request: any, reply: FastifyReply) => {
  try {
    const user = getUser(request);

    const { page = 1, limit = 10, doctorId, date, status } = request.query;

    const query: any = {
      tenantId: user.tenantId,
    };

    if (doctorId) query.doctorId = doctorId;
    if (date) query.date = date;
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name phone')
      .populate('doctorId', 'name')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ date: -1 });

    const formatted = appointments.map((appt: any) => ({
      _id: appt._id,
      date: appt.date,
      patientId: appt.patientId?._id,
      patient: appt.patientId?.name,
      phone: appt.patientId?.phone,
      startTime: appt.startTime,
      endTime: appt.endTime,
      status: appt.status,
      doctorId: appt.doctorId?._id,
      doctor: appt.doctorId?.name,
    }));

    const total = await Appointment.countDocuments(query);

    return reply.send(
      successResponse('Api successful', { appointments: formatted, total, page, limit }),
    );
  } catch (err) {
    return reply.status(500).send(errorResponse('Server error', ERROR_CODES.SERVER_ERROR));
  }
};

export async function getAppointmentById(request: any, reply: any) {
  try {
    const user = getUser(request);

    const appointment = await Appointment.findOne({
      _id: request.params.id,
      tenantId: user.tenantId,
    })
      .populate('patientId')
      .populate('doctorId');

    if (!appointment) {
      return reply.code(404).send({
        success: false,
        errors: [{ code: 'NOT_FOUND', message: 'Appointment not found' }],
      });
    }

    return reply.send(successResponse('Api successful', appointment));
  } catch (err) {
    return reply.status(500).send(errorResponse('Server error', ERROR_CODES.SERVER_ERROR));
  }
}

export async function updateAppointment(request: any, reply: any) {
  try {
    const user = getUser(request);

    const { doctorId, date, startTime } = request.body;

    // 🔥 Conflict check (if rescheduling)
    if (doctorId && date && startTime) {
      const existing = await Appointment.findOne({
        tenantId: user.tenantId,
        doctorId,
        date,
        startTime,
        _id: { $ne: request.params.id },
        status: { $ne: 'cancelled' },
      });

      if (existing) {
        return reply.code(400).send({
          success: false,
          errors: [{ code: 'SLOT_BOOKED', message: 'Slot already booked' }],
        });
      }
    }

    // 🔥 Auto update status
    let updateData: any = { ...request.body };

    if (doctorId && date && startTime) {
      updateData.status = 'booked';
    }

    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: request.params.id,
        tenantId: user.tenantId,
      },
      updateData,
      { new: true },
    );

    if (!appointment) {
      return reply.code(404).send({
        success: false,
        errors: [{ code: 'NOT_FOUND', message: 'Appointment not found' }],
      });
    }

    return reply.send(successResponse('Api successful', appointment));
  } catch (err) {
    return reply.status(500).send(errorResponse('Server error', ERROR_CODES.SERVER_ERROR));
  }
}

export async function cancelAppointment(request: any, reply: any) {
  try {
    const user = getUser(request);

    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: request.params.id,
        tenantId: user.tenantId,
      },
      { status: 'cancelled' },
      { new: true },
    );

    if (!appointment) {
      return reply.code(404).send({
        success: false,
        errors: [{ code: 'NOT_FOUND', message: 'Appointment not found' }],
      });
    }

    return reply.send(successResponse('Api successful', { message: 'Appointment cancelled' }));
  } catch (err) {
    console.log('Error cancelling appointment:', err);
    return reply.status(500).send(errorResponse('Server error', ERROR_CODES.SERVER_ERROR));
  }
}
