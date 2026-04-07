import jwt from 'jsonwebtoken';
import { JwtUser } from '../types/auth';

export const generateToken = (user: any) => {
  return jwt.sign(
    {
      id: user._id,
      tenantId: user.tenantId,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' },
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!) as JwtUser;
};
