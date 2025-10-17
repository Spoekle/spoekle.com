import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
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

    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(collection => collection.name);

    return NextResponse.json({ collections: collectionNames });
  } catch (error) {
    console.error('Error listing collections:', error);
    return NextResponse.json(
      { error: 'Error listing collections' },
      { status: 500 }
    );
  }
}
