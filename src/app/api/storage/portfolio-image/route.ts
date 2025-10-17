import { NextRequest } from 'next/server';
import { requireAuth, requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/apiResponse';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const currentUser = requireAuth(request);
    requireAdmin(currentUser);

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return validationErrorResponse('No image file provided');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return validationErrorResponse('File must be an image');
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return validationErrorResponse('File size must be less than 5MB');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const filename = `portfolio-${timestamp}${ext}`;

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'portfolio');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (mkdirError) {
      console.error('Failed to create uploads directory:', mkdirError);
      // Continue anyway, directory might already exist
    }

    // Save file
    const filepath = path.join(uploadsDir, filename);
    try {
      await writeFile(filepath, buffer);
    } catch (writeError) {
      console.error('Failed to write file:', writeError);
      throw new Error(`Failed to save file: ${writeError instanceof Error ? writeError.message : 'Unknown error'}`);
    }

    const imageUrl = `/api/uploads/portfolio/${filename}`;

    return successResponse({
      imageUrl,
      filename,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading portfolio image:', error);
    return errorResponse(error);
  }
}
