import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    if (!user.roles.includes('admin')) {
      return errorResponse(new Error('Forbidden'), 403);
    }
    
    await dbConnect();

    const users = await User.find().select('-password').sort({ createdAt: -1 });

    return successResponse(users);
  } catch (error) {
    return errorResponse(error);
  }
}
