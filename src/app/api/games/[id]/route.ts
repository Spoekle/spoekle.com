import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Game from '@/models/Games';
import { requireAuth, requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse, notFoundResponse, validationErrorResponse } from '@/lib/apiResponse';

// GET /api/games/[id] - Get a single game by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await dbConnect();

    const game = await Game.findOne({ id }).lean();
    
    if (!game) {
      return notFoundResponse('Game not found');
    }
    
    return successResponse(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    return errorResponse(error);
  }
}

// PUT /api/games/[id] - Update a game (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const currentUser = requireAuth(request);
    requireAdmin(currentUser);

    await dbConnect();

    const body = await request.json();
    
    const game = await Game.findOneAndUpdate(
      { id },
      body,
      { new: true, runValidators: true }
    );

    if (!game) {
      return notFoundResponse('Game not found');
    }

    return successResponse({
      message: 'Game updated successfully',
      game
    });
  } catch (error) {
    console.error('Error updating game:', error);
    return errorResponse(error);
  }
}

// DELETE /api/games/[id] - Delete a game (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const currentUser = requireAuth(request);
    requireAdmin(currentUser);

    await dbConnect();

    const game = await Game.findOneAndDelete({ id });

    if (!game) {
      return notFoundResponse('Game not found');
    }

    return successResponse({
      message: 'Game deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting game:', error);
    return errorResponse(error);
  }
}

// PATCH /api/games/[id] - Toggle game active status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const currentUser = requireAuth(request);
    requireAdmin(currentUser);

    await dbConnect();

    const game = await Game.findOne({ id });
    
    if (!game) {
      return notFoundResponse('Game not found');
    }

    game.active = !game.active;
    await game.save();

    return successResponse({
      message: 'Game status toggled successfully',
      game
    });
  } catch (error) {
    console.error('Error toggling game status:', error);
    return errorResponse(error);
  }
}
