import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    
    // Only admins can access database management
    if (!user || !user.roles.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    
    if (!mongoose.connection.db) {
      return NextResponse.json(
        { error: 'Database connection not established' },
        { status: 500 }
      );
    }
    
    const { collection } = await params;
    
    // Check if collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some(col => col.name === collection);
    
    if (!collectionExists) {
      return NextResponse.json(
        { error: `Collection '${collection}' not found` },
        { status: 404 }
      );
    }
    
    // Drop the collection
    await mongoose.connection.db.dropCollection(collection);
    
    return NextResponse.json({ 
      message: `Collection '${collection}' dropped successfully` 
    });
  } catch (error: any) {
    console.error('Error dropping collection:', error);
    return NextResponse.json(
      { error: 'Error dropping collection', message: error.message },
      { status: 500 }
    );
  }
}
