import { FastifyInstance } from 'fastify';
import { getBusinessHours } from './businessHours.controller';

export default async function (fastify: FastifyInstance) {
  fastify.get('/business-hours', getBusinessHours);
}
