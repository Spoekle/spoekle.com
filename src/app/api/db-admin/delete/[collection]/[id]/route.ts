import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

export async function DELETE(
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
    
    // Find the document before deletion to return it in the response
    const documentToDelete = await mongoose.connection.db.collection(collection).findOne({ _id: objectId });
    
    if (!documentToDelete) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }
    
    // Delete the document directly using MongoDB driver
    const result = await mongoose.connection.db.collection(collection).deleteOne({ _id: objectId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Document deleted successfully', 
      document: documentToDelete 
    });
  } catch (error: any) {
    console.error('Error deleting document from collection:', error);
    return NextResponse.json(
      { error: 'Error deleting document', message: error.message },
      { status: 500 }
    );
  }
}
