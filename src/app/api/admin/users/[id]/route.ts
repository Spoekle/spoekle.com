import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = requireAuth(request);
    if (!currentUser.roles.includes('admin')) {
      return errorResponse(new Error('Forbidden'), 403);
    }
    
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      body,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = requireAuth(request);
    if (!currentUser.roles.includes('admin')) {
      return errorResponse(new Error('Forbidden'), 403);
    }
    
    await dbConnect();
    const { id } = await params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return errorResponse(new Error('User not found'), 404);
    }

    return successResponse({ message: 'User deleted successfully' });
  } catch (error) {
    return errorResponse(error);
  }
}
