import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// GET /api/cdn/images/[...path] - Serve images from public/cdn/images
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const imagePath = params.path.join('/');
    const filePath = path.join(process.cwd(), 'public', 'cdn', 'images', imagePath);

    // Security check - ensure path doesn't escape cdn directory
    const normalizedPath = path.normalize(filePath);
    const cdnDir = path.join(process.cwd(), 'public', 'cdn', 'images');
    if (!normalizedPath.startsWith(cdnDir)) {
      return NextResponse.json(
        { error: 'Invalid path' },
        { status: 400 }
      );
    }

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = await fs.readFile(filePath);

    // Determine content type
    const ext = path.extname(filePath).toLowerCase();
    const contentTypeMap: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };
    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    // Return image with proper headers
    return new NextResponse(fileBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json(
      { error: 'Failed to serve image' },
      { status: 500 }
    );
  }
}
