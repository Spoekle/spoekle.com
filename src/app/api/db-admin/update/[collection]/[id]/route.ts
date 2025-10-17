import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
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
    
    const { collection, id } = await params;
    const body = await request.json();
    const { document } = body;
    
    // Remove _id from the document if present (MongoDB doesn't allow _id updates)
    if (document._id) {
      delete document._id;
    }
    
    // Convert string ID to ObjectId
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(id);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid document ID format' },
        { status: 400 }
      );
    }
    
    // Update the document directly using MongoDB driver
    const result = await mongoose.connection.db.collection(collection).updateOne(
      { _id: objectId },
      { $set: document }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }
    
    // Get the updated document
    const updatedDocument = await mongoose.connection.db.collection(collection).findOne({ _id: objectId });
    
    return NextResponse.json({ 
      message: 'Document updated successfully', 
      document: updatedDocument 
    });
  } catch (error: any) {
    console.error('Error updating document in collection:', error);
    return NextResponse.json(
      { error: 'Error updating document', message: error.message },
      { status: 500 }
    );
  }
}
