import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import Fastify from 'fastify';
import connectDB from './config/db';

import authRoutes from './modules/auth/auth.routes';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

if (!JWT_SECRET || !MONGO_URI) {
  console.error('Missing required environment variables: JWT_SECRET and MONGO_URI');
  process.exit(1);
}

const app = Fastify({ logger: true });

// plugins
app.register(cors, { origin: true });
app.register(jwt, { secret: JWT_SECRET });

// routes
app.register(authRoutes, { prefix: '/auth' });

app.get('/', async () => {
  return { message: 'API running 🚀' };
});

const start = async () => {
  try {
    await connectDB();
    await app.listen({ port: 8000 });
    console.log('Server running at http://localhost:8000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
