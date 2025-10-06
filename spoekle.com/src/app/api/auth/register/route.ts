import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { hashPassword } from '@/lib/password';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/apiResponse';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { username, email, password } = await request.json();

    if (!username || !password) {
      return validationErrorResponse('Username and password are required');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return validationErrorResponse('Username already exists');
    }

    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return validationErrorResponse('Email already exists');
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      roles: ['user'],
      status: 'active',
    });

    await newUser.save();

    return successResponse(
      {
        message: 'User registered successfully',
        user: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          roles: newUser.roles,
        },
      },
      201
    );
  } catch (error) {
    console.error('Registration error:', error);
    return errorResponse(error);
  }
}
