import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { requireAuth } from '@/lib/auth';
import sharp from 'sharp';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await dbConnect();

    const formData = await request.formData();
    const file = formData.get('profilePicture') as File;
    
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
    const filename = `profile_${user.id}_${timestamp}.jpg`;

    // Create directory if it doesn't exist
    const profileDir = path.join(process.cwd(), 'public', 'cdn', 'images', 'profile');
    await mkdir(profileDir, { recursive: true });

    // Process and save profile picture (400x400, circular crop)
    const profileImage = await sharp(buffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    const imagePath = path.join(profileDir, filename);
    await writeFile(imagePath, profileImage);

    // Update user's profile picture in database
    const cdnDomain = process.env.NEXT_PUBLIC_CDN_URL || 'http://localhost:3000';
    const profilePictureUrl = `${cdnDomain}/cdn/images/profile/${filename}`;

    await User.findByIdAndUpdate(user.id, {
      profilePicture: profilePictureUrl,
    });

    return NextResponse.json({
      success: true,
      profilePicture: profilePictureUrl,
    });
  } catch (error: any) {
    console.error('Profile picture upload error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: 'Failed to upload profile picture' },
      { status: 500 }
    );
  }
}
