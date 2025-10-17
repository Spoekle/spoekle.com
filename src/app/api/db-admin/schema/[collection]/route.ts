import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(
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
    const model = mongoose.models[collection];
    
    if (!model) {
      // If no model is found, get a sample document to infer schema
      const sampleDoc = await mongoose.connection.db.collection(collection).findOne();
      if (!sampleDoc) {
        return NextResponse.json({ schema: {} }); // Empty schema if no documents
      }
      
      // Create a schema representation from the sample document
      const inferredSchema = Object.entries(sampleDoc).reduce((schema: any, [key, value]) => {
        if (key === '_id') return schema; // Skip _id field
        
        let type;
        if (value === null) {
          type = 'Mixed';
        } else if (Array.isArray(value)) {
          type = 'Array';
        } else if (value instanceof Date) {
          type = 'Date';
        } else {
          type = typeof value;
        }
        
        schema[key] = { type };
        return schema;
      }, {});
      
      return NextResponse.json({ schema: inferredSchema });
    }
    
    const schema = model.schema.obj;
    return NextResponse.json({ schema });
  } catch (error) {
    console.error('Error getting schema for collection:', error);
    return NextResponse.json(
      { error: 'Error getting schema' },
      { status: 500 }
    );
  }
}
