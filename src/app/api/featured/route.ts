import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import FeaturedItem from '@/models/FeaturedItem';
import { requireAuth, requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/apiResponse';

// GET /api/featured - Get all active featured items
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    let query: any = {};
    
    if (!includeInactive) {
      query.active = true;
    }

    const items = await FeaturedItem.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return successResponse(items);
  } catch (error) {
    console.error('Error fetching featured items:', error);
    return errorResponse(error);
  }
}

// POST /api/featured - Create a new featured item (admin only)
export async function POST(request: NextRequest) {
  try {
    const currentUser = requireAuth(request);
    requireAdmin(currentUser);

    await dbConnect();

    const body = await request.json();
    const { title, description, imageUrl, linkUrl, type, order, active } = body;

    if (!title || !description || !imageUrl || !linkUrl) {
      return validationErrorResponse('Title, description, imageUrl, and linkUrl are required');
    }

    const newItem = new FeaturedItem({
      title,
      description,
      imageUrl,
      linkUrl,
      type: type || 'custom',
      order: order !== undefined ? order : 0,
      active: active !== undefined ? active : true,
    });

    const savedItem = await newItem.save();
    
    return successResponse(
      {
        id: savedItem._id,
        message: 'Featured item created successfully',
      },
      201
    );
  } catch (error) {
    console.error('Error creating featured item:', error);
    return errorResponse(error);
  }
}
