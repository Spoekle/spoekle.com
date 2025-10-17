import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { requireAuth, requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/apiResponse';

export async function POST(request: NextRequest) {
  try {
    const currentUser = requireAuth(request);
    requireAdmin(currentUser);

    const formData = await request.formData();
    const file = formData.get('blogImage') as File;

    if (!file) {
      return validationErrorResponse('No image file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return validationErrorResponse('Invalid file type. Only JPEG, PNG, WEBP, and GIF files are allowed.');
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return validationErrorResponse('File size exceeds 5MB limit');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const filename = `blog-${timestamp}${ext}`;

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'blog');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Save file
    const filepath = path.join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    const imageUrl = `/api/uploads/blog/${filename}`;

    return successResponse({
      imageUrl,
      filename,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading blog image:', error);
    return errorResponse(error);
  }
}
