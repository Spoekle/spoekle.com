import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = requireAuth(request);
    if (!currentUser.roles.includes('admin')) {
      return errorResponse(new Error('Forbidden'), 403);
    }
    
    await dbConnect();

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      { isApproved: true },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return errorResponse(new Error('User not found'), 404);
    }

    return successResponse(updatedUser);
  } catch (error) {
    return errorResponse(error);
  }
}
