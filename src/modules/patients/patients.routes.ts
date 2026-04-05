import { FastifyInstance } from 'fastify';
import { getPatients } from './patients.controller';

export default async function (fastify: FastifyInstance) {
  fastify.get('/patients', getPatients);
}
