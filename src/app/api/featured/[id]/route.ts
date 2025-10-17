import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import FeaturedItem from '@/models/FeaturedItem';
import { requireAuth, requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse, validationErrorResponse, notFoundResponse } from '@/lib/apiResponse';

// GET /api/featured/[id] - Get a single featured item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const item = await FeaturedItem.findById(id).lean();

    if (!item) {
      return notFoundResponse('Featured item not found');
    }

    return successResponse(item);
  } catch (error) {
    console.error('Error fetching featured item:', error);
    return errorResponse(error);
  }
}

// PUT /api/featured/[id] - Update a featured item (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = requireAuth(request);
    requireAdmin(currentUser);

    await dbConnect();
    const { id } = await params;

    const body = await request.json();
    const { title, description, imageUrl, linkUrl, type, order, active } = body;

    if (!title || !description || !imageUrl || !linkUrl) {
      return validationErrorResponse('Title, description, imageUrl, and linkUrl are required');
    }

    const updateData: any = {
      title,
      description,
      imageUrl,
      linkUrl,
      type: type || 'custom',
      order: order !== undefined ? order : 0,
      active: active !== undefined ? active : true,
    };

    const item = await FeaturedItem.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!item) {
      return notFoundResponse('Featured item not found');
    }
    
    return successResponse({
      id: item._id,
      message: 'Featured item updated successfully',
    });
  } catch (error) {
    console.error('Error updating featured item:', error);
    return errorResponse(error);
  }
}

// DELETE /api/featured/[id] - Delete a featured item (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = requireAuth(request);
    requireAdmin(currentUser);

    await dbConnect();
    const { id } = await params;

    const item = await FeaturedItem.findByIdAndDelete(id);
    
    if (!item) {
      return notFoundResponse('Featured item not found');
    }
    
    return successResponse({ message: 'Featured item deleted successfully' });
  } catch (error) {
    console.error('Error deleting featured item:', error);
    return errorResponse(error);
  }
}
