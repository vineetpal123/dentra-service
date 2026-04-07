import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: string;
      role: string;
    };
    user: {
      tenantId: any;
      id: string;
      role: string;
    };
  }
}
