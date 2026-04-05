import { FastifyInstance } from 'fastify';
import { getDashboard } from './dashboard.controller';

export default async function (fastify: FastifyInstance) {
  fastify.get('/dashboard', getDashboard);
}
