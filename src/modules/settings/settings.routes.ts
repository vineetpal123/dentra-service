import { FastifyInstance } from 'fastify';
import { getSettings } from './settings.controller';

export default async function (fastify: FastifyInstance) {
  fastify.get('/settings', getSettings);
}
