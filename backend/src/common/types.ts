import { Request } from 'express';

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  resetToken: string | null;
  resetTokenExpiry: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user: User;
}
