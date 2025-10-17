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
    
    const { collection } = await params;
    const body = await request.json();
    const { page = 1, limit = 20, sort = { _id: -1 }, query = {} } = body;
    
    // Access collection directly using the MongoDB driver
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection not established' },
        { status: 500 }
      );
    }
    const skip = (page - 1) * limit;
    
    // Execute query directly on the MongoDB collection
    const documents = await db.collection(collection)
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
    
    const total = await db.collection(collection).countDocuments(query);
    
    return NextResponse.json({ 
      documents, 
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Error getting documents for collection:', error);
    return NextResponse.json(
      { error: 'Error getting documents' },
      { status: 500 }
    );
  }
}
