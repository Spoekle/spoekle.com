import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { hashPassword, comparePassword } from '@/lib/password';

export async function GET(request: NextRequest) {
  try {
    const currentUser = requireAuth(request);
    
    console.log('GET /api/users/me - Token user:', currentUser);
    
    await dbConnect();

    const user = await User.findById(currentUser.id).select('-password');
    
    console.log('GET /api/users/me - User from DB:', user);
    
    if (!user) {
      return errorResponse(new Error('User not found'), 404);
    }

    const responseData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      profilePicture: user.profilePicture,
      status: user.status,
      discordId: user.discordId,
      discordUsername: user.discordUsername,
    };
    
    console.log('GET /api/users/me - Sending response:', responseData);

    return successResponse(responseData);
  } catch (error) {
    console.error('GET /api/users/me - Error:', error);
    return errorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = requireAuth(request);
    
    await dbConnect();
    const body = await request.json();
    const { username, email, currentPassword, newPassword } = body;

    const existingUser = await User.findById(currentUser.id);
    if (!existingUser) {
      return errorResponse(new Error('User not found'), 404);
    }

    // Check if username is taken by another user
    if (username && username !== existingUser.username) {
      const usernameTaken = await User.findOne({ username, _id: { $ne: currentUser.id } });
      if (usernameTaken) {
        return errorResponse(new Error('Username already taken'), 409);
      }
      existingUser.username = username;
    }

    // Check if email is taken by another user
    if (email && email !== existingUser.email) {
      const emailTaken = await User.findOne({ email, _id: { $ne: currentUser.id } });
      if (emailTaken) {
        return errorResponse(new Error('Email already in use'), 409);
      }
      existingUser.email = email;
    }

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return errorResponse(new Error('Current password is required'), 400);
      }

      const isPasswordValid = await comparePassword(currentPassword, existingUser.password);
      if (!isPasswordValid) {
        return errorResponse(new Error('Current password is incorrect'), 400);
      }

      existingUser.password = await hashPassword(newPassword);
    }

    await existingUser.save();

    return successResponse({
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      roles: existingUser.roles,
      profilePicture: existingUser.profilePicture,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

