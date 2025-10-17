import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Photo from '@/models/Photo';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { Readable } from 'stream';
// @ts-ignore - no types available
import exifParser from 'exif-parser';

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to convert Next.js request to Node.js readable stream
async function parseFormData(request: NextRequest) {
  const formData = await request.formData();
  return formData;
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const photos = await Photo.find()
      .populate('userId', 'username profilePicture')
      .sort({ createdAt: -1 });

    return NextResponse.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || (!user.roles.includes('admin') && !user.roles.includes('uploader'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('photo') as File;
    const title = formData.get('title') as string || 'Untitled Photo';
    const description = formData.get('description') as string || '';
    const category = formData.get('category') as string || 'Other';
    const location = formData.get('location') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Create upload directories if they don't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'photos');
    const thumbnailsDir = path.join(process.cwd(), 'public', 'uploads', 'thumbnails');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    if (!fs.existsSync(thumbnailsDir)) {
      fs.mkdirSync(thumbnailsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const filename = `photo-${timestamp}${ext}`;
    const thumbnailFilename = `thumb-${timestamp}${ext}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract EXIF metadata before processing
    let exifData: any = {};
    try {
      const parser = exifParser.create(buffer);
      const result = parser.parse();
      exifData = result.tags;
    } catch (exifError) {
      console.log('No EXIF data found or error parsing EXIF:', exifError);
    }

    // Save and optimize original image
    const imagePath = path.join(uploadsDir, filename);
    await sharp(buffer)
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(imagePath);

    // Generate thumbnail (maintain aspect ratio)
    const thumbnailPath = path.join(thumbnailsDir, thumbnailFilename);
    await sharp(buffer)
      .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);

    // Extract image metadata
    const metadata = await sharp(buffer).metadata();
    
    // Build photo metadata object
    const photoMetadata: any = {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
    };

    // Add EXIF data if available
    if (exifData.Make) photoMetadata.camera = `${exifData.Make} ${exifData.Model || ''}`.trim();
    if (exifData.LensModel) photoMetadata.lens = exifData.LensModel;
    if (exifData.ISO) photoMetadata.iso = `${exifData.ISO}`;
    if (exifData.FNumber) photoMetadata.aperture = `f/${exifData.FNumber}`;
    if (exifData.ExposureTime) {
      // Convert exposure time to fraction if it's less than 1 second
      if (exifData.ExposureTime < 1) {
        photoMetadata.shutterSpeed = `1/${Math.round(1 / exifData.ExposureTime)}s`;
      } else {
        photoMetadata.shutterSpeed = `${exifData.ExposureTime}s`;
      }
    }
    if (exifData.FocalLength) photoMetadata.focalLength = `${exifData.FocalLength}mm`;
    if (exifData.DateTimeOriginal) photoMetadata.takenAt = new Date(exifData.DateTimeOriginal * 1000);

    // Add GPS location if available
    if (exifData.GPSLatitude && exifData.GPSLongitude) {
      photoMetadata.gpsLocation = {
        latitude: exifData.GPSLatitude,
        longitude: exifData.GPSLongitude,
      };
    }

    if (location) {
      photoMetadata.location = location;
    }

    // Create photo record
    const photo = new Photo({
      title,
      description,
      imageUrl: `/api/uploads/photos/${filename}`,
      thumbnailUrl: `/api/uploads/thumbnails/${thumbnailFilename}`,
      category,
      metadata: photoMetadata,
      userId: user.id,
    });

    await photo.save();

    return NextResponse.json({ 
      message: 'Photo uploaded successfully',
      photo 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json(
      { error: 'Failed to create photo' },
      { status: 500 }
    );
  }
}
