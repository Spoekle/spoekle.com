import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { comparePassword } from '@/lib/password';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/apiResponse';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { username, password } = await request.json();

    if (!username || !password) {
      return validationErrorResponse('Username and password are required');
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return validationErrorResponse('Invalid credentials');
    }

    // Check if user is approved
    if (user.isApproved === false) {
      return errorResponse(new Error('Account is pending admin approval'), 403);
    }

    // Check if user is active
    if (user.status === 'disabled') {
      return validationErrorResponse('Account is disabled');
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return validationErrorResponse('Invalid credentials');
    }

    // Generate JWT token
    const token = generateToken({
      _id: (user._id as any).toString(),
      username: user.username,
      roles: user.roles,
    });

    return successResponse({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(error);
  }
}
