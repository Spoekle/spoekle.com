import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Security: Prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json(
        { success: false, message: 'Invalid filename' },
        { status: 400 }
      );
    }

    const filepath = path.join(process.cwd(), 'uploads', 'blogImages', filename);

    if (!existsSync(filepath)) {
      return NextResponse.json(
        { success: false, message: 'Image not found' },
        { status: 404 }
      );
    }

    const fileBuffer = await readFile(filepath);
    
    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    const contentTypeMap: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };
    
    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error retrieving blog image:', error);
    return NextResponse.json(
      { success: false, message: 'Error retrieving image' },
      { status: 500 }
    );
  }
}
