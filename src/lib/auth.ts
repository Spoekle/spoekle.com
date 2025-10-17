import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { User } from '@/types';

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

export interface TokenPayload {
  id: string;
  username: string;
  roles: string[];
}

export function generateToken(user: { _id: string; username: string; roles: string[] }): string {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      roles: user.roles,
    },
    SECRET_KEY,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function getUserFromRequest(request: NextRequest): TokenPayload | null {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyToken(token);
}

export function requireAuth(request: NextRequest): TokenPayload {
  const user = getUserFromRequest(request);
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

export function requireRoles(user: TokenPayload, roles: string[]): void {
  const hasRequiredRole = roles.some(role => user.roles.includes(role));
  
  if (!hasRequiredRole) {
    throw new Error('Forbidden: Insufficient permissions');
  }
}

export function requireAdmin(user: TokenPayload): void {
  requireRoles(user, ['admin']);
}

export function requireEditor(user: TokenPayload): void {
  requireRoles(user, ['admin', 'editor']);
}
