import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';
import { hashPassword } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !user.roles.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const { username, email, password, roles, status } = await request.json();

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 409 }
        );
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = new User({
      username,
      email: email || undefined,
      password: hashedPassword,
      roles: roles || ['user'],
      status: status || 'active',
      isApproved: true,
    });

    await newUser.save();

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        roles: newUser.roles,
        status: newUser.status,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
