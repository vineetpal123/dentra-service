import { FastifyInstance } from 'fastify';
import { getAppointments } from './appointments.controller';

export default async function (fastify: FastifyInstance) {
  fastify.get('/appointments', getAppointments);
}
