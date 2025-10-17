import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { requireAuth } from '@/lib/auth';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    
    // Check if user has permission to upload
    if (!user.roles.includes('admin') && !user.roles.includes('editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedName}`;

    // Create directories if they don't exist
    const fullDir = path.join(process.cwd(), 'public', 'cdn', 'images', 'photos', 'full');
    const thumbDir = path.join(process.cwd(), 'public', 'cdn', 'images', 'photos', 'thumbnails');
    
    await mkdir(fullDir, { recursive: true });
    await mkdir(thumbDir, { recursive: true });

    // Process and save full-size image (max 2000px width, 90% quality)
    const fullImage = await sharp(buffer)
      .resize(2000, 2000, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    const fullPath = path.join(fullDir, filename);
    await writeFile(fullPath, fullImage);

    // Create thumbnail (400px width, 80% quality)
    const thumbnail = await sharp(buffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    const thumbFilename = `thumb_${filename}`;
    const thumbPath = path.join(thumbDir, thumbFilename);
    await writeFile(thumbPath, thumbnail);

    // Return URLs (use environment variable for production CDN domain)
    const cdnDomain = process.env.NEXT_PUBLIC_CDN_URL || 'http://localhost:3000';
    
    return NextResponse.json({
      success: true,
      imageUrl: `${cdnDomain}/cdn/images/photos/full/${filename}`,
      thumbnailUrl: `${cdnDomain}/cdn/images/photos/thumbnails/${thumbFilename}`,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
