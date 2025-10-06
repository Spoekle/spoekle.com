import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has admin role
    if (!user.roles || !user.roles.includes('admin')) {
      return NextResponse.json(
        { success: false, message: 'Forbidden - Admin role required' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('blogImage') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads', 'blogImages');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = path.join(uploadsDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Build CDN URL (or local URL for development)
    const imageUrl = process.env.NODE_ENV === 'production'
      ? `https://cdn.spoekle.com/api/cdn/images/blog/${filename}`
      : `/api/storage/blog-image/${filename}`;

    return NextResponse.json({
      success: true,
      data: { imageUrl }
    });
  } catch (error) {
    console.error('Error uploading blog image:', error);
    return NextResponse.json(
      { success: false, message: 'Error uploading image' },
      { status: 500 }
    );
  }
}
