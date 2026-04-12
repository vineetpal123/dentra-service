import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import Fastify from 'fastify';
import connectDB from './config/db';

import appointmentsRoutes from './modules/appointments/appointments.routes';
import authRoutes from './modules/auth/auth.routes';
import businessHoursRoutes from './modules/businessHours/businessHours.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import patientsRoutes from './modules/patients/patients.routes';
import settingsRoutes from './modules/settings/settings.routes';
import userRoutes from './modules/users/user.routes';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

if (!JWT_SECRET || !MONGO_URI) {
  console.error('Missing required environment variables: JWT_SECRET and MONGO_URI');
  process.exit(1);
}

const app = Fastify({ logger: true });
const API_PREFIX = '/api/v1';

// plugins
app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

app.register(jwt, { secret: JWT_SECRET });

// routes
app.register(authRoutes, { prefix: '/auth' });
app.register(dashboardRoutes, { prefix: API_PREFIX });
app.register(appointmentsRoutes, { prefix: API_PREFIX });
app.register(patientsRoutes, { prefix: API_PREFIX });
app.register(settingsRoutes, { prefix: API_PREFIX });
app.register(businessHoursRoutes, { prefix: API_PREFIX });
app.register(userRoutes, { prefix: API_PREFIX });

app.get('/', async () => {
  return { message: 'API running 🚀' };
});

const start = async () => {
  try {
    await connectDB();
    const port = process.env.PORT ? parseInt(process.env.PORT) : 8000;
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`Server running at http://0.0.0.0:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
