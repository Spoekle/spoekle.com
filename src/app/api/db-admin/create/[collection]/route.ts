import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

export async function POST(
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
    const body = await request.json();
    const { document } = body;
    
    // Access collection directly using the MongoDB driver
    const result = await mongoose.connection.db.collection(collection).insertOne(document);
    
    // Get the inserted document
    const newDocument = await mongoose.connection.db.collection(collection).findOne({ _id: result.insertedId });
    
    return NextResponse.json(
      { message: 'Document created successfully', document: newDocument },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating document in collection:', error);
    return NextResponse.json(
      { error: 'Error creating document', message: error.message },
      { status: 500 }
    );
  }
}
