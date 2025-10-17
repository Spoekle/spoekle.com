import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Photo from '@/models/Photo';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const photo = await Photo.findById(id).populate('uploadedBy', 'username');

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Error fetching photo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photo' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || (!user.roles.includes('admin') && !user.roles.includes('editor'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const body = await request.json();
    const { id } = await params;

    const photo = await Photo.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Error updating photo:', error);
    return NextResponse.json(
      { error: 'Failed to update photo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || !user.roles.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const { id } = await params;
    const photo = await Photo.findById(id);

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    // Delete the image files from filesystem
    try {
      const imagePath = path.join(process.cwd(), 'public', photo.imageUrl);
      const thumbnailPath = path.join(process.cwd(), 'public', photo.thumbnailUrl);
      
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    } catch (fileError) {
      console.error('Error deleting photo files:', fileError);
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await Photo.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}
